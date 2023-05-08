const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'files');
const sourceCopy = path.join(__dirname, 'files-copy');

async function copyDir(source, sourceCopy) {
  try {
    await fs.promises.rm(sourceCopy, {recursive: true});
  } finally {
    await fs.promises.mkdir(sourceCopy, {recursive: true});

    const files = await fs.promises.readdir(source, {withFileTypes: true});

    for (let file of files) {
      const sourceFile = path.join(source, file.name);
      const sourceCopyFile = path.join(sourceCopy, file.name);
      if (file.isFile()) {
        fs.promises.copyFile(sourceFile, sourceCopyFile);
      } else {
        copyDir(sourceFile, sourceCopyFile);
      }
    }
  }
}
copyDir(source, sourceCopy);