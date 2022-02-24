module.exports = function({ src, dest }, $, paths, isProd, server) {

  const { allSizeDirs, getVersionDir, getSizeDir } = require('./shared.js')($, paths);

  const zipSizes = function() {
    return src([`${paths.dest}/**`])

      .pipe($.flatmap(function(stream, file) {

        const versionDir = getVersionDir(file);
        const sizeDir = getSizeDir(file);

        return src(`${paths.dest}/${versionDir}/${sizeDir}/**/*`)
          // .pipe($.zip(`${versionDir.replace(paths.ft+'-Creative', '')}-${sizeDir}.zip`))
          .pipe($.zip(`${versionDir.replace(paths.ft+'_Creative', '')}_${sizeDir}.zip`))
          .pipe($.size({ title: `${versionDir} ${sizeDir}` }))
          .pipe(dest(`${paths.zip}/${versionDir}`));
      }));

  };

  return {
    zipSizes
  };
};
