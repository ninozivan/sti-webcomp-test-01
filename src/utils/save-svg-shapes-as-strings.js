const fs = require('fs-extra');
const glob = require('glob-promise');
const path = require('path');
const util = require('util');

// first, we will get a list of all of the icons in the source folder
glob('src/svg-optimized/*.svg')
  // next, read the files, using svgson to parse
  .then(filePaths =>
    Promise.all(
      filePaths.map(fileName => {
        return new Promise(resolve => {
          fs.readFile(fileName, 'utf-8').then(svg => {
            resolve({ file: fileName, svg });
          });
        });
      }),
    ),
  )
  // write a JSON file inside the asset folder for each icon
  .then(files => {
    files.forEach(item => {
      let itemNameWithExt = path.basename(item.file);
      // Make sure this folder exists!
      const nameWithoutExtension = path.parse(itemNameWithExt).name;
      let filename = `src/svg-shapes-as-strings/${nameWithoutExtension}.json`;
      fs.writeFileSync(filename, JSON.stringify(item.svg), 'utf8');
    });
    process.exit(0);
  });
