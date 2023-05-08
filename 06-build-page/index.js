const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const htmlPath = path.join(directoryPath, 'index.html');
const stylesPath = path.join(__dirname, 'styles');
const finallyStyles = path.join(__dirname, 'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(__dirname, 'project-dist', 'assets');

async function createDir(directory) {
  await fs.promises.mkdir(directory, {recursive: true});
}
createDir(directoryPath);

async function createHtml(html) {
  let readableStream = fs.createReadStream(templatePath, 'utf8');
  let writableStream = fs.createWriteStream(htmlPath);

  let components = await getComponents();

  readableStream.on('data', function(chunk){
      let html = chunk;
      for (let component in components) {
        html = html.replace(`{{${component}}}`, components[component]);
      }
      writableStream.write(html);
  });
}
createHtml(templatePath);

async function getComponents() {
  const components = {};

  const files = await fs.promises.readdir(componentsPath, {withFileTypes: true});
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const fileSourse = path.join(__dirname, 'components', file.name);
      const fileExtname = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, `.${fileExtname}`);
      const fileHtml = (await fs.promises.readFile(fileSourse)).toString();

      components[fileName] = fileHtml;
    }
  }
  return components;
}

function createCss() {
  let writableStream = fs.createWriteStream(finallyStyles);

  fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
    if (err) console.error(err);

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileSourse = path.join(__dirname, 'styles', file.name);
        fs.createReadStream(fileSourse).pipe(writableStream);
      }
    })
  });
}
createCss();

async function copyDir(source, sourceCopy) {
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
copyDir(assetsPath, assetsCopyPath);