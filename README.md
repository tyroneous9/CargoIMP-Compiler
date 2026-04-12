Setup:
1. create an email parser for alimail
  - npm: node-imap
2. From aParse (parse2.com), use their parser generator to create the parser for FWB, FHL, FFM.
3. create a node backend which has an endpoint to the final, parsed data

Method:
1. fetch emails from alimail (can poll), store the subject+body 
2 pipeline the email (stdout) into parser (stdin)
3. parse the email into json
4. pipeline json into backend. a front end may not be needed in this case unless input is necessary
5. consider automating data entry into spreadsheets