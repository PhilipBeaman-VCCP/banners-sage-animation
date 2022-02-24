// Helpers for shared assets
const glob = require('glob');
const path = require('path');
const del = require('del');
const { src } = require('gulp');


module.exports = function($, paths) {

  const isSizeDirectory = dir => (/\d{2,4}x\d{2,4}$/g).test(dir);
  const allFiles = glob.sync(`${paths.src}/banners/**/*`);
  const allVersions = glob.sync(`${paths.src}/banners/*`);

  const allVersionDirs = allVersions.map((item) => {
    const dirArray = item.split(path.sep);
    const dirLength = parseInt(dirArray.length -1);
    const versionDir = dirArray[dirLength];
    return versionDir;
  });

  // https://stackoverflow.com/questions/46986710/return-multiple-values-from-es6-map-function/46986771
  const allVersionAssetDirs = allVersionDirs.reduce(
    function(accumulator, item) {
      accumulator.push(`${paths.temp}/${item}/images/`, `${paths.temp}/${item}/scripts/`);
      return accumulator;
    }, 
  []);

  const allSizeDirs = allFiles.filter(isSizeDirectory);


  const getVersionDir = function(file) {
    const dirArray = file.path.split(path.sep);
    const dirLength = parseInt(dirArray.length -2);
    const versionDir = dirArray[dirLength];
    
    return versionDir;
  };


  const getSizeDir = function(file) {
    const sizeDir = file.path.split(path.sep).pop();
    return sizeDir;
  };


  const bannerData = function(file) {
    const pathData = {};
    const dirArray = file.path.split(path.sep);
    const sizeDirArray = dirArray.filter(isSizeDirectory);

    if (sizeDirArray.length > 0) {

      // Remove everything below the size directory
      while (isSizeDirectory(dirArray[dirArray.length - 1]) === false) {
        dirArray.pop();
      }

      pathData.version = dirArray[dirArray.length - 2];
      pathData.size = dirArray[dirArray.length - 1];

      pathData.width = pathData.size.split('x')[0];
      pathData.height = pathData.size.split('x')[1];

      return pathData;
    }

    return false;
  };


  const replaceBannerVariables = function(stream, file) {
    const data = bannerData(file);

    if (data) {
      return stream
        .pipe($.replace('$bannerVersion', data.version))
        .pipe($.replace('$bannerSize', data.size))
        .pipe($.replace('$bannerWidth', data.width))
        .pipe($.replace('$bannerHeight', data.height));
    }

    return stream;
  };


  const cleanAllVersionAssets = function() {
    return del(allVersionAssetDirs);
  };

  // Loops all banner sizes and updates with shared assets from the top level or from a version
  const loopSizes = function(level, assets, callback, fileExtension = '') {

    return src(allSizeDirs)
      .pipe($.flatmap(function(stream, file) {

        const versionDir = getVersionDir(file);
        const sizeDir = getSizeDir(file);

        if(level === 'global') {
          return callback(`${paths.src}/${assets}/*${fileExtension}`, `${paths.temp}/${versionDir}/${sizeDir}/${assets}/`);
        }

        if(level === 'version') {
          return callback(`${paths.src}/banners/${versionDir}/${assets}/*${fileExtension}`, `${paths.temp}/${versionDir}/${sizeDir}/${assets}/`);
        }

        if(level === 'size') {
          return callback(`${paths.src}/banners/${versionDir}/${sizeDir}/${assets}/*${fileExtension}`, `${paths.temp}/${versionDir}/${sizeDir}/${assets}/`);
        }

      }));

  };


  return {
    allVersionDirs,
    allVersionAssetDirs,
    allSizeDirs,
    getVersionDir,
    getSizeDir,
    bannerData,
    replaceBannerVariables,
    cleanAllVersionAssets,
    loopSizes
  };

};
