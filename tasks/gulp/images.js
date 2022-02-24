const { lastRun } = require('gulp');


module.exports = function({ src, dest }, $, paths, envProduction, server) {

  const { loopSizes } = require('./shared.js')($, paths);
  const assetDir = 'images';


  const imagesTask = function(srcFolder, destFolder, stream) {
    return src(srcFolder, { since: lastRun(images) })
      .pipe(dest(destFolder));
  };


  const globalImages = () => loopSizes('global', assetDir, imagesTask);

  const versionImages = () => loopSizes('version', assetDir, imagesTask);

  const images = () => loopSizes('size', assetDir, imagesTask);

  const imagesFT = () => imagesTask(`${paths.src}/images${paths.ft}/*`, `${paths.temp}/images`);


  return {
    globalImages,
    versionImages,
    images,
    imagesFT
  };
};
