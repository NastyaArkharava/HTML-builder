const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const source = path.join(__dirname, 'text.txt');
let writableStream = fs.createWriteStream(source);

const consoleText = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function writeText() {
  consoleText.question('Enter text: ', (text) => {
    if (text === 'exit') {
      process.exit(1);
    }
    writableStream.write(`${text}\n`);
    writeText();
  });
}
writeText();

process.on('exit', () => {
  console.log('\nEntry completed');
})