/*
Points to update 
- JSON file path
- Store name
- Store Admin API Access Token
- setTimeout value : suggested to be atleast 1 second to avoid hitting rate limit i.e. 
approx 11 cost points consumed per mutation call
- variable values for emailMarketingStatus check Shopide dev docs
JSON format for customer GID:
[{"id":"gid://shopify/Customer/6128117416135"},{"id":"gid://shopify/Customer/6129105666247"}]
*/

var fs = require("fs");
var axios = require('axios')
const { resolve } = require("path");
var GID ="";
/* VARIABLES TO CHANGE */
const storeName = "xstack-dev"; // Change this
const api_token = "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"; // Add your token here
var inputJson = storeName+"_Output_CustomersGID.json"; // your input JSON file for variables

// Form header with token to pass as part of post request
const storeHeaders = {
  "X-Shopify-Access-Token": api_token,
  "Content-Type": "application/json"
};
const storeUrl = `https://${storeName}.myshopify.com/admin/api/2022-07/graphql.json`;

//Step 1 : Read json file 
function startUpdateProcess() {
	fs.readFile(inputJson, function(err, data)
		{
			if(err){ // If error occurred while reading file
				console.log("Error occured while reading json file");
			} else {
				var jsonObj = JSON.parse(data);
				console.log("### Json file parsed ###");
				// count of rows / ids
				var count = Object.keys(jsonObj).length;
				console.log(count);
				formCustomerMutation(jsonObj, count) // Call to next method to get
			}
		}
	)
};

//Step 2 iterate json to get customer gid to be sent in mutation variable
async function formCustomerMutation(jsonObj, count){
	for(let key in jsonObj){
			GID = jsonObj[key].id;
			if (key <= count) {
				const updateStatus = await updateEmailStatus(GID);
				console.log(key +" : "+updateStatus);
			}
		}
	}
// Step 3 : Post mutation call to Shopify store
 async function updateEmailStatus(GID){
	console.log('Inside updateEmailStatus Method. Customer Id : ' + GID);
	// Form the mutation for Email Marketing Status to "SUBSCRIBED" for each customer
const body = {
  query: `
  mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
        customer {
            id, 
            emailMarketingConsent {
                marketingState,
                marketingOptInLevel
            }
        }
        userErrors { 
            field, 
            message }
    }
}`,
  variables: 
  { "input": {"emailMarketingConsent":{"marketingState":"SUBSCRIBED","marketingOptInLevel":"SINGLE_OPT_IN"},
    "customerId":GID}
  }
};

// POST call to send mutation to Shopify store
axios.post(storeUrl, body, { headers: storeHeaders })
  .catch(err => {
    console.log('Error Something Went Wrong')  //failure
    console.error(err);
  })
  .then(res => {
    console.log('Email Status Updated to SUBSCRIBED')  //success
    console.log('###############################');
  })

	return new Promise(resolve => setTimeout(resolve, 3000));  // To set delay of 3 seconds before next mutation is triggered
}

startUpdateProcess(); // Main function to start reading json file and execute mutation one by one