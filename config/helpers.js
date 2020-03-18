const path = require('path');
const rootPath = path.resolve(__dirname, '..');

const transformManifest = (buffer, filePath) => {
  let manifest = {};
  try {
    manifest = JSON.parse(buffer.toString());
  } catch(e) {
    const relativeFilePath = path.relative(rootPath, filePath);
    e.message = `${e.message} in ${relativeFilePath}`

    throw e;
  }

  const {
    npm_package_name,
    npm_package_version: version,
    npm_package_description: description,
    npm_package_author: author,
  } = process.env;

  // change dash to space and uppercase first letter
  const name = npm_package_name.replace('-', ' ').replace(/^\w/, c => c.toUpperCase());
  const newManifest = {
    ...manifest,
    name,
    version,
    description,
    author,
  }

  return JSON.stringify(newManifest, null, 2);
}

exports.transformManifest = transformManifest;
