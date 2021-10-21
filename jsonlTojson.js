const fs = require('fs');
// To install node-jsonl module run :  npm install --save node-jsonl 
const jsonl = require("node-jsonl");

var storeName = "xstack";
var inputJsonlFileName = "./" + storeName + "_bulkOperation.jsonl"; // referenced fromm bulkDownload.js
var outputJsonFileName = storeName + "_bulkOutput.json";

async function convertJsonlToJson() {

  const rl = jsonl.readlines(inputJsonlFileName);
  var urlListFromJsonl = [];

  while (true) {
    const { value, done } = await rl.next()
    if (done) break;
    // console.log(value);
    urlListFromJsonl.push(value);
  }

  // write URL to json file in your directory
  fs.writeFile(outputJsonFileName, JSON.stringify(urlListFromJsonl), 'utf8', err => {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file : ' + outputJsonFileName);
    }
  })

}
convertJsonlToJson();

module.exports = { convertJsonlToJson };