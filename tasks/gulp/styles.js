const sass = require('gulp-sass')(require('sass'));

module.exports = function({ src, dest }, $, paths, envProduction, server) {
  const { replaceBannerVariables } = require('./shared.js')($, paths);

  const styles = function() {
    return src([`${paths.src}/banners/**/*/styles/*.scss`], {
        sourcemaps: !envProduction,
      })
      .pipe($.plumber())

      .pipe($.flatmap(function(stream, file) {
        return replaceBannerVariables(stream, file);
      }))
      
      .pipe(sass.sync({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.']
      })
      .on('error', sass.logError))

      .pipe($.postcss([]))

      .pipe(dest(`${paths.temp}`, {
        sourcemaps: !envProduction,
      }))
      .pipe(server.reload({stream: true}));
  };

  return {
    styles
  };
};
