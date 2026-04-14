#include <algorithm>
#include <exception>
#include <fstream>
#include <iostream>
#include <map>
#include <string>

#include "Parser.hpp"
#include "ParserException.hpp"
#include "Rule.hpp"
#include "fwb17_json_extractor.hpp"
#include "parser_error_logger.hpp"

int main(int argc, char* argv[])
{
  std::string* lc_argv = new std::string[argc];
  for (int i = 0; i < argc; i++)
  {
    lc_argv[i] = argv[i];
    std::transform(lc_argv[i].begin(), lc_argv[i].end(), lc_argv[i].begin(), tolower);
  }

  std::map<std::string, std::string> arguments;
  std::string error("");
  bool ok = argc > 1;

  if (ok)
  {
    arguments["Trace"] = "Off";
    arguments["Rule"] = "FWB17";

    for (int i = 1; i < argc; i++)
    {
      if (lc_argv[i].compare("-trace") == 0)
      {
        arguments["Trace"] = "On";
      }
      else if (lc_argv[i].compare("-file") == 0)
      {
        if (i < argc - 1) arguments["File"] = argv[++i];
      }
      else if (lc_argv[i].compare("-string") == 0)
      {
        if (i < argc - 1) arguments["String"] = argv[++i];
      }
      else if (lc_argv[i].compare("-rule") == 0)
      {
        if (i < argc - 1) arguments["Rule"] = argv[++i];
      }
      else
      {
        error = std::string("unknown argument: ") + argv[i];
        ok = false;
      }
    }
  }

  delete[] lc_argv;

  if (ok)
  {
    if (arguments.find("File") == arguments.end() &&
        arguments.find("String") == arguments.end())
    {
      error = "insufficient arguments: -file or -string required";
      ok = false;
    }
  }

  const Rule* rule = NULL;

  if (!ok)
  {
    parser_logging::logError("parser_fwb17_json", std::string("argument error: ") + error);
    std::cerr << "error: " << error << std::endl;
    std::cerr << "usage: parser_fwb17_json [-rule rulename] [-trace] <-file file | -string string>" << std::endl;
  }
  else
  {
    try
    {
      if (arguments.find("File") != arguments.end())
      {
        std::ifstream file(arguments["File"].c_str());
        if (!file.is_open())
        {
          parser_logging::logError("parser_fwb17_json", std::string("io error: unable to open ") + arguments["File"]);
          std::cerr << "io error: unable to open " << arguments["File"] << std::endl;
        }
        else
        {
          rule = Parser::parse(
            arguments["Rule"],
            file,
            arguments["Trace"].compare("On") == 0);
        }
      }
      else if (arguments.find("String") != arguments.end())
      {
        rule = Parser::parse(
          arguments["Rule"],
          arguments["String"],
          arguments["Trace"].compare("On") == 0);
      }

      if (rule != NULL)
      {
        Fwb17JsonExtractor visitor;
        rule->accept(visitor);
      }
    }
    catch (ParserException& e)
    {
      parser_logging::logError("parser_fwb17_json", std::string("parser error: ") + e.what());
      std::cerr << "parser error: " << e.what();
    }
    catch (std::exception& e)
    {
      parser_logging::logError("parser_fwb17_json", std::string("runtime error: ") + e.what());
      std::cerr << "error: " << e.what() << std::endl;
    }
    catch (...)
    {
      parser_logging::logError("parser_fwb17_json", "unknown error");
      std::cerr << "unknown error" << std::endl;
    }
  }

  if (rule != NULL) delete rule;

  return rule != NULL ? 0 : 1;
}