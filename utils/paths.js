const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (...pathSements) => path.resolve(appDirectory, ...pathSements);

module.exports = {
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  appDist: resolveApp('dist'),
};
