const fs = require('fs');
const path = require('path');

/**
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 */
function readFilesSync(dir) {
  const files = [];

  fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if (isFile && ext === '.svg') files.push({ name });
  });

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    // https://stackoverflow.com/a/38641281
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  console.log('files here', files);

  return files;
}

// return an array list of objects
// each object represent a file
const files = readFilesSync('src/svg-optimized/');

fs.writeFileSync('src/utils/list-of-icons.json', JSON.stringify(files), function (err) {
  if (err) return console.log(err);
  console.log('Success');
});
