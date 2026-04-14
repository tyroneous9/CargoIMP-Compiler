Setup:
1. create an email parser for alimail
  - npm: node-imap
2. From aParse (parse2.com), use their parser generator to create the parser for FWB17, FHL4, FFM8.
  - create grammar for each message format. e.g. FFM8 should have its own format vs FWB17. Note that the 8 and 17 are the version number.
  - current grammars to do: FFM8, FHL4, FWB17.
3. create a node backend which has an endpoint to the final, parsed data.

Method:
1. fetch emails from alimail (can poll), store the subject+body.
  - WARNING: subject can be mismatched with body. For example subject is FFM8, but actually the message is FWB17. Prioritize body line, and also validate the parse.
2 pipeline the email (stdout) into parser (stdin).
3. parse the email into json.
  - example: ./build/parser_fwb17_json -file data/input_tests/fwb17_1.txt
4. pipeline json into backend. a front end may not be needed in this case unless input is necessary.

Test inputs:
./build/parser_ffm_json -file data/input_tests/ffm_1.txt
./build/parser_fwb17_json -file data/input_tests/fwb17_1.txt
./build/parser_fhl4_json -file data/input_tests/fhl4_1.txt

Output shape:
shape:
{
  "email": {
    "uid": 6001,
    "date": "2026-04-13T20:19:51.000Z",
    "subject": "Example",
    "from": "sender@example.com",
    "body": "RAW MESSAGE TEXT..."
  },
  "parsing": {
    "status": "ok",
    "format": "fwb17",
    "fields": {
      "awbPrefix": "123",
      "awbNumber": "45678901"
    },
    "stderr": ""
  }
}

database:
parsed information only--similar to wms data

temporary email storage: