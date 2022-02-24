module.exports = function({ src, dest }, $, paths, isProd, server) {

  const topLevel = function() {
    return src(`${paths.src}/top-level/**/*`)
      .pipe(dest(`${paths.dest}`));
  };

  return {
    topLevel
  };

};
