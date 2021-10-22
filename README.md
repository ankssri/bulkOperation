# bulkOperation

Node js code to download "Files" (Settings > Files) URLs list with Shopify bulkOperation API (GraphQL) and upload URLs list to another Shopify store (Settins > Files) using File API (GraphQL).

Included nodejs files :
1. bulkDownload.js
2. jsonlTojson.js (bulkOperation.js references this file to convert .jsonl file .json )
3. UploadFiles.js
4. reformatJson.js (To reformat json file to change key names requried for File upload query. This scenario is specific to Files API as key name of downloaded file is different)

bulkDownload.js executes following steps
1. Form the mutation with bulkOperationsQuery. Update pagination to desired limit e.g. 100,000 for bulk operation 
2. bulkOperation runs on Shopify servers and only 1 bulkOperation can execute for a store at a time.
3. Check status of bulkOperationRunQuery status and get URL link to download file. 
   You can use webhook option also instead of polling
4. Generated file will be of the format ".jsonl" . Download .jsonl file. 
5. Convert .jsonl to .json format ( done by jsonlTojson.js )

Execution steps:

Step 1: node bulkDownload.js <br>
Step 2: node reformatJson.js ( this file needs to be made generic to cover all scenarios) <br>
Step 3: node UploadFiles.js
