#!/usr/bin/env bash
# usage example: bash generate_parsers.sh data/grammars/grammar_file_name.abnf [VisitorA,VisitorB]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CPP_ROOT="$(dirname "$SCRIPT_DIR")"
JAR_PATH="$CPP_ROOT/tools/aparse-2.5.jar"
GENERATED_PARSERS_DIR="$CPP_ROOT/data/generated_parsers"

if [[ $# -lt 1 ]]; then
	echo "Usage: $0 <grammar.abnf> [visitors]" >&2
	echo "Example: $0 data/grammars/fwb17_grammar.abnf Displayer,XmlDisplayer" >&2
	echo "Default visitors: Displayer,XmlDisplayer" >&2
	exit 1
fi

VISITORS="${2:-Displayer,XmlDisplayer}"

if [[ "$1" = /* ]]; then
	GRAMMAR_PATH="$1"
else
	GRAMMAR_PATH="$CPP_ROOT/$1"
fi

if [[ ! -f "$JAR_PATH" ]]; then
	echo "Error: aParse jar not found at $JAR_PATH" >&2
	exit 1
fi

if [[ ! -f "$GRAMMAR_PATH" ]]; then
	echo "Error: grammar file not found at $GRAMMAR_PATH" >&2
	exit 1
fi

# Extract grammar name and create subdirectory
GRAMMAR_FILENAME=$(basename "$GRAMMAR_PATH" .abnf)
GRAMMAR_SUBDIR="${GRAMMAR_FILENAME/_grammar/_parsers}"
DEST_DIR="$GENERATED_PARSERS_DIR/$GRAMMAR_SUBDIR"

mkdir -p "$DEST_DIR"

java -cp "$JAR_PATH" com.parse2.aparse.Parser \
	-language cpp \
  -main \
  -visitors "$VISITORS" \
	-destdir "$DEST_DIR" \
	"$GRAMMAR_PATH"

# Post-process: Fix TR1 regex compatibility for modern C++ (GCC 11+)
# aParse 2.5 generates std::tr1::regex which doesn't exist in C++11+
find "$DEST_DIR" -name "*.cpp" -print0 | xargs -0 sed -i 's/using std::tr1::regex;/using std::regex;/g'

echo "Generated parsers into: $DEST_DIR"
echo "Visitors generated: $VISITORS"