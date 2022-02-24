const handleErrors = require('./errors');


module.exports = function({ src, dest }, $, paths, envProduction, server) {

  const assetDir = 'scripts';
  const { allSizeDirs, getVersionDir, getSizeDir, replaceBannerVariables, loopSizes } = require('./shared.js')($, paths);


  const scriptsTask = function(srcFolder, destFolder) {
    return src(srcFolder, {
        sourcemaps: !envProduction,
      })
      .pipe($.plumber())

      .pipe($.esbuild({
        outdir: destFolder,
        bundle: true,
        minify: envProduction,
        sourcemap: !envProduction
      }))
      .on('error', handleErrors)

      .pipe(dest('./', {
        sourcemaps: !envProduction,
      }))
      .on('error', handleErrors)

      .pipe(server.reload({stream: true}));
  };

  const libsTask = function(srcFolder, destFolder) {
    return src(srcFolder)
      .pipe(dest(destFolder))
      .on('error', handleErrors)
      .pipe(server.reload({stream: true}));
  };


  const globalScripts = () => loopSizes('global', assetDir, scriptsTask, '.js');
  const globalLibsScripts = () => loopSizes('global', `${assetDir}/libs`, libsTask);
  const globalLocalScripts = () => loopSizes('global', `${assetDir}/local`, libsTask);

  const versionScripts = () => loopSizes('version', assetDir, scriptsTask);

  const scripts = () => loopSizes('size', assetDir, scriptsTask);


  const replaceBannerVariablesScripts = function() {
    return src(`${paths.temp}/*/*/${assetDir}/*.js`)
      .pipe($.plumber())
      .pipe($.flatmap(function(stream, file) {
        return replaceBannerVariables(stream, file);
      }))
      .pipe(dest(`${paths.temp}`))
  };


  return {
    globalScripts,
    globalLibsScripts,
    globalLocalScripts,
    versionScripts,
    scripts,
    replaceBannerVariablesScripts
  }

};
