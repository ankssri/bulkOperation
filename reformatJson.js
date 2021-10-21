const fs = require("fs");

function reformatJson() {
    // 1. get the json data
    // This is string data
    const fileData = fs.readFileSync("./xstack_bulkOutput.json", "utf8");
    // Use JSON.parse to convert string to JSON Object
    const jsonData = JSON.parse(fileData);

    // 2. update the value of one key
    jsonData.forEach(
        obj => renameKey(obj, 'mediaContentType', 'contentType')
    );

    jsonData.forEach(
        obj => renameKey(obj, 'originalSrc', 'originalSource')
    );
    const updatedJson = JSON.stringify(jsonData);

    // 3. write it back to your json file
    fs.writeFile("./xstack_final.json", updatedJson, 'utf8', err => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            console.log('Successfully wrote file : xstack_final.json');
        }
    });
}

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

reformatJson();

