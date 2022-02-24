module.exports = function({ src, dest }, $, paths, envProduction, server) {

  const { loopSizes } = require('./shared.js')($, paths);
  const assetDir = 'fonts';


  const fontsTask = function(srcFolder, destFolder, stream) {
    return src(srcFolder)
      .pipe(dest(destFolder));
  };


  // Global assets
  const fonts = () => loopSizes('global', assetDir, fontsTask);


  return {
    fonts
  };

};
