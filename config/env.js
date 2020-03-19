const isProduction = process.env.NODE_ENV === 'production'
const {
  npm_package_name: name,
  npm_package_version: version,
  npm_package_description: description,
  npm_package_author: author,
} = process.env;

module.exports = {
  isProduction,
  isDevelopment: !isProduction,
  npmPackage: {
    name,
    version,
    description,
    author,
  },
}
