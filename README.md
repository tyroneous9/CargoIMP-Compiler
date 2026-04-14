Setup:
1. create an email parser for alimail
  - npm: node-imap
2. From aParse (parse2.com), use their parser generator to create the parser for FWB, FHL, FFM.
  - create grammar for each message format. e.g. FFM/8 should have its own format vs FWB/17. Note that the 8 and 17 are the version number.
  - current grammars to do: FFM/8, FHL/4, FWB/17.
3. create a node backend which has an endpoint to the final, parsed data.

Method:
1. fetch emails from alimail (can poll), store the subject+body.
  - WARNING: subject can be mismatched with body. For example subject is FFM, but actually the message is FWB. Prioritize body line, and also validate the parse.
2 pipeline the email (stdout) into parser (stdin).
3. parse the email into json.
  - example: ./build/parser_fwb17_json -file data/input_tests/fwb17_1.txt
4. pipeline json into backend. a front end may not be needed in this case unless input is necessary.

Test inputs:
./build/parser_ffm_json -file data/input_tests/ffm_1.txt
./build/parser_fwb17_json -file data/input_tests/fwb17_1.txt
./build/parser_fhl4_json -file data/input_tests/fhl4_1.txt