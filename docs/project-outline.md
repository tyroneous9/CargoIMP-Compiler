Setup:
1. create an email parser for alimail
  - npm: node-imap
2. From aParse (parse2.com), use their parser generator to create the parser for FWB, FHL, FFM.
  - create grammar for each message format. e.g. FFM should have its own format vs FWB.
  - current grammars: FFM (supports FFM/4, FFM/5, FFM/8), FHL (supports FHL/4, FHL/5), FWB (supports FWB/17).
3. create a node backend which has an endpoint to the final, parsed data.

Method:
1. fetch emails from alimail (can poll), store the subject+body.
  - WARNING: subject can be mismatched with body. For example subject is FFM8, but actually the message is FWB17. Prioritize body line, and also validate the parse.
2 pipeline the email (stdout) into parser (stdin).
3. parse the email into json.
  - example: ./build/parser_fwb_json -file data/input_tests/fwb_test.txt
4. pipeline json into backend. a front end may not be needed in this case unless input is necessary.

Test inputs:
./build/parser_ffm_json -file data/input_tests/ffm_test.txt
./build/parser_fwb_json -file data/input_tests/fwb_test.txt
./build/parser_fhl_json -file data/input_tests/fhl_test.txt


database:

parsed information only--similar to wms data
temporary email storage:
store files locally, and reference via .csv

preprocessing email: edit preprocessing to be more robust

guard against IMAP/network failures. consider polling algorithm--should verify outputs after creation

given the email outputs generated in server/date/outputs/emails, create a script which parses these emails using existing parsers in cpp directory. advice:
1. reference the already working #file:poll_and_parse_emails.js for its alraedy working parsing functionality.
2. in the email outputs, reference the #cimpType field to quickly choose the correct parser.

support for FFM/4, FFM/5, FHL/5



CSV CREATION:
Email send order:
FFM, FWB, FHL
Filter out out of scope shipments (WRONG DESTINATION, NON-ORD)
Linking House to PMC by weight/piece count deduction is fundamentally impossible because there are infinite possibilities. Consider this example: Given total weight of HAWB X = 3813 kg, distributed across 7 ULDs whose individual allocations are 4286 kg, 59 kg, 295 kg... — determine how many kg of HAWB X are in each ULD.
IDEAS for linking:
1. investigate working software from NCA.
2. scan HAWB which an existing PMC mapping.
3. probabilistic linking

POLLER SCRIPT:
1. initializes
2. repeats at a time interval "EMAIL_POLL_INTERVAL_MS" set in .env
3. runs #extract_emails.js
4. runs #parse_extracted_emails.js
5. runs #build_cfs_csv_mawb.js and #build_cfs_csv_uld.js
6. runs #upload_tables_to_sheets.js



CURRENT PIPELINE:
- PARSERS
1. grammars are used to generate parsers
2. build executables for programs which use parsers to output parsed information to json (stdout)
3. executables can be used on input (from emails) to extract useful parsed information to json
- EMAILS

TODO:
actual departure date can be extracted from mvt
apply further parsing on scheduled arrival/departure info lines
pipeline:force is deleting cache?
normalize field naming across pipeline--grammar pasing names, csv header names, etc