const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'text.txt');

let readableStream = fs.createReadStream(source, 'utf8');

readableStream.on('data', function(chunk){
    console.log(chunk);
});