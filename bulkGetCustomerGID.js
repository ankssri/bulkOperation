/* 
This code does following:
1. Form the mutation with bulkOperationsQuery. Update pagination to desired limit e.g. 100,000 for bulk operation 
2. bulkOperation runs on Shopify servers and only 1 bulkOperation can execute for a store at a time.
3. Check status of bulkOperationRunQuery status and get URL link to download file. 
   You can use webhook option also instead of polling
4. Generated file will be of the format ".jsonl" . Download .jsonl file. 
5. Convert .jsonl to .json format
*/

var axios = require('axios')

/* VARIABLES TO CHANGE */
const store = ""; // Add your store name
const apiversion = "2022-07" // Use latest api version
const api_token = ""; // Add your token here
var maxBatchLimit = 5000;

// header with token to pass as part of post request
const storeHeaders = {
    "X-Shopify-Access-Token": api_token,
    "Content-Type": "application/json"
};
const storeUrl = `https://${store}.myshopify.com/admin/api/${apiversion}/graphql.json`;


getCustomerGIDBulkOperation(); //Main function to start execution

// Step 1: Execute code to get Customer GIDs
async function getCustomerGIDBulkOperation() {
    var body = { // Form Bulk Mutation query
        query: `mutation {
        bulkOperationRunQuery(
        query: """
        {
            customers (first : ${maxBatchLimit}, query:"accepts_marketing:false") { 
              edges {
                node {
                        id
                    }
                }
            }
        }    
        """
        ) {  
            bulkOperation {   
                    id
                    status  
            }
            userErrors {  
                    field
                    message
            }
        }
    }     
    ` };
    //Send bulk mutation to your store which will be sent to Shopify server
    const myresponse = axios.post(storeUrl, body, { headers: storeHeaders })
        .catch(err => {
            console.log('-------- 1. Error Something Went Wrong----------');  //failure
            console.error(err);
        })
        .then(res => {
            console.log('-------- 1. Bulk Request Sent Successfully ! --------');  //success
            console.log('- - -');
            console.log('- - - wait for 10 sec')
            //console.log(res);
            /* Next step to check status of Bulk Operation completion.
            Implementation is in getStatus() */
            setTimeout(getStatus, 10000);  // Added 10 sec wait time before executing getStatus()
        })
};

// Step 2. To check BulkOperation completion status
function getStatus() {
    const bulkStatusquery = {
        query: `{
        currentBulkOperation {
            id
            status
            errorCode
            createdAt
            completedAt
            objectCount
            fileSize
            url
            partialDataUrl
          } 
        }    
        `
    };
    const mybulkstatus = axios.post(storeUrl, bulkStatusquery, { headers: storeHeaders })
        .catch(err => {
            console.log('-------- 2. bulkstatus Error Something Went Wrong -------');  //failure
            console.error(err);
        })
        .then(res => {
            console.log('-------- 2. Bulk Operation Status Request Sent Successfully ! -------');  //success
            console.log('- - - wait for 5 sec');
            //console.log(res.data);
            console.log('- - -');
            //console.log(res.data.data.currentBulkOperation.url);
            /* Step 3 download .jsonl file from Shopify server */
            setTimeout(downloadBulkJSONLFile, 5000, res.data.data.currentBulkOperation.url);
        })
}

// Step 3. Download .jsonl file into your project directory from Shopify server. 
// file name <storename>_bulkOperation.jsonl
function downloadBulkJSONLFile(fileURL) {
    console.log("-------- 3. Downloading file from Shopify Server ------")
    const https = require('https');
    const fs = require('fs');

    const file = fs.createWriteStream(store + "_bulkOperation.jsonl");  // downloading file with this name
    const request = https.get(fileURL, function (response) {
        response.pipe(file);
    });
    console.log('--- File download complete : ' + store + '_bulkOperation.jsonl ---');
    console.log('- - - wait for 5 seconds');
    console.log('- - -');
    // Step 4: convert jsonl file to json format
    setTimeout(jsonlToJson, 5000);
}

//Step 4 convert .jsonl file to json format
// Refer to file jsonlTojson.js , generated json file name : <storename>_bulkOperation.json
function jsonlToJson() {
    console.log("-------- 4. Converting .jsonl to json -------");
    const convert = require("./jsonlTojson.js");
    //const result = setTimeout(convert.convertJsonlToJson(), 7000);
    console.log(" --- file conversion completed ----");
    console.log('- - -');

}
