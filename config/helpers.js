const path = require('path');

const { appPath } = require('./paths');
const { npmPackage, isDevelopment } = require('./env');

const parseJsonFromBuffer = (buffer, filePath) => {
  try {
    return JSON.parse(buffer.toString());
  } catch (e) {
    const relativeFilePath = path.relative(appPath, filePath);
    e.message = `${e.message} in ${relativeFilePath}`

    throw e;
  }
};

const transformManifest = (buffer, filePath) => {
  const manifest = parseJsonFromBuffer(buffer, filePath);
  const name = npmPackage.name.replace('-', ' ').replace(/^\w/, c => c.toUpperCase()); // change dash to space and uppercase first letter
  const { description, author, version } = npmPackage;
  const newManifest = {
    ...manifest,
    name,
    version,
    description,
    author,
  };

  // Because Webpack use eval to execute code when development, add CSP policy to prevent `Uncaught EvalError`
  if (isDevelopment) {
    newManifest['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
  }

  return JSON.stringify(newManifest, null, 2);
};

exports.transformManifest = transformManifest;
