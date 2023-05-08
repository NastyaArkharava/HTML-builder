const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'secret-folder');

fs.readdir(source, {withFileTypes: true}, (err, files) => {
  if (err) console.error(err);

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(source, file.name);
      const fileExtname = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, `.${fileExtname}`);
      fs.stat(filePath, (err, stats) => {
        if (err) console.error(err);

        const fileSize = `${stats.size / 1024}kb`;
        console.log(`${fileName} - ${fileExtname} - ${fileSize}`);
      });
    }
  });
});