var axios = require('axios')
const fs = require("fs");

/* VARIABLES TO CHANGE */
const store = "xstack"; // Change this
const api_token = ""; // Add your token here

// Form header with token to pass as part of post request
const storeHeaders = {
  "X-Shopify-Access-Token": api_token,
  "Content-Type": "application/json"
};
const storeUrl = `https://${store}.myshopify.com/admin/api/2021-07/graphql.json`;

// Reading local json file to form the variable (input) to be passed as part of mutation
// URLsToUploadList.json has array of images to be uploaded
var outputJsonFileName = "./" + store + "_final.json";
const urlsMutationVariables = require(outputJsonFileName);  //fs module can be used for large files
//const urlsMutationVariables = JSON.stringify(inputJson);

// Form the mutation for File (image) upload to Shopify Settings -> Files section
const body = {
  query: `
    mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          userErrors {
            field
            message
          }
          files {
            createdAt
          }
        }
      }      
    `,
  variables: urlsMutationVariables
  /* {
     "files": [
       {
         "originalSource": "https://cdn.shopify.com/s/files/1/0577/5523/8456/files/getty_511938412_2000133320009280222_334891.jpg?v=1632832528",
         "contentType": "IMAGE"
       },
       {
         "originalSource": "https://cdn.shopify.com/s/files/1/0577/5523/8456/files/plus.png?v=1632832552",
         "contentType": "IMAGE"
       }
     ]
   }*/
};

//Send mutation i.e. image url upload to store files
axios.post(storeUrl, body, { headers: storeHeaders })
  .catch(err => {
    console.log('Error Something Went Wrong')  //failure
    console.error(err);
  })
  .then(res => {
    console.log('Uploaded Successfully !')  //success
    console.log('- - -');
    console.log(res);
  })