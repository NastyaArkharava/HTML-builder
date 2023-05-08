const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'styles');
const finallySource = path.join(__dirname, 'project-dist', 'bundle.css');

let writableStream = fs.createWriteStream(finallySource);

fs.readdir(source, {withFileTypes: true}, (err, files) => {
  if (err) console.error(err);

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const fileSourse = path.join(__dirname, 'styles', file.name);
      fs.createReadStream(fileSourse).pipe(writableStream);
    }
  })
});