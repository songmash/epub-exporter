const {
  npm_package_name: name,
  npm_package_version: version,
  npm_package_description: description,
  npm_package_author: author,
  NODE_ENV,
} = process.env;
const isProduction = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDevelopment = !(isProduction || isTest);

module.exports = {
  isProduction,
  isDevelopment,
  isTest,
  npmPackage: {
    name,
    version,
    description,
    author,
  },
};
