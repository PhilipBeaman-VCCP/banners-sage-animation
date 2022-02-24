// ----- Imports and variables ------
const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const cssnano = require('cssnano');
const $ = gulpLoadPlugins();
const server = browserSync.create();

const envProduction = process.env.NODE_ENV === 'production';
const envDeploy = process.env.DEPLOY === 'true';
const envBannerType = process.env.BANNER_TYPE; 
// console.log(`Production: ${envProduction}, Banner Type: ${envBannerType}, Deploy: ${envDeploy}, `);


const paths = {
  src: 'src',
  temp: 'temp',
  dest: 'build',
  zip: 'zip',
  gulp: './tasks/gulp',
  ft : '-FT'
};


// ----- Import tasks ------
function getTask(task) {
	return require(`${paths.gulp}/${task}.js`)({ src, dest }, $, paths, envProduction, server, envDeploy);
}

let { markup, createFTFiles, replaceBannerVariablesJSON } = getTask('markup');
if (envBannerType === 'flashtalking') markup = series(markup, createFTFiles);
exports.markup = markup;
exports.replaceBannerVariablesJSON = replaceBannerVariablesJSON;
exports.createFTFiles = createFTFiles;

const { styles } = getTask('styles'); 
exports.styles = styles;

const { globalScripts, globalLibsScripts, globalLocalScripts, versionScripts, scripts, lint, replaceBannerVariablesScripts } = getTask('scripts');
exports.scripts = scripts;
exports.lint = lint;

const allScripts = series(globalScripts, globalLibsScripts, globalLocalScripts, versionScripts, scripts, replaceBannerVariablesScripts);
exports.allScripts = allScripts;

const { globalImages, versionImages, images, imagesFT } = getTask('images');
let allImages = series(globalImages, versionImages, images);
if (envBannerType === 'flashtalking') allImages = parallel(series(globalImages, versionImages, images), imagesFT);

exports.images = images;
exports.imagesFT = imagesFT;
exports.globalImages = globalImages;
exports.versionImages = versionImages;
exports.allImages = allImages;

const { fonts } = getTask('fonts');
exports.fonts = fonts;

const { topLevel } = getTask('top-level'); 
exports.topLevel = topLevel

const { zipSizes } = getTask('zip');
exports.zipSizes = zipSizes


// ----- Build tasks ------
function clean() {
  return del([`${paths.temp}`, `${paths.dest}`, `${paths.zip}`]);
}
exports.clean = clean;


let filesToCompress = [`${paths.temp}/**/*`, `!${paths.temp}/**/*.js`, `!${paths.temp}/**/local`, `${paths.temp}/**/main.js`, `${paths.temp}/**/libs/*.js`];
if (envDeploy) filesToCompress.push(`${paths.temp}/**/manifest.js`);

const compress = function() {
  return src(filesToCompress)
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe($.if(/\.html$/,
      $.replace('is-dev', '')
    ))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
    
    .pipe(dest(`${paths.dest}`));
}
exports.compress = compress;


const measureSize = function() {
  return src(`${paths.dest}/**/*`)
    .pipe($.size({title: 'build', gzip: true}));
}

const compile = series(
  clean, 
  parallel(markup, styles, fonts), 
  allScripts, 
  allImages
);
exports.compile = compile;

const build = series(
  compile,

  topLevel,
  compress,
  measureSize
);
exports.build = build;
exports.default = build;


const imagesFTBuild = function() {
  return src([`${paths.dest}/images/*`])
  .pipe(dest(`${paths.zip}/images/`));
}

let zip = series(build, zipSizes);
if (envBannerType === 'flashtalking') zip = series(build, zipSizes, imagesFTBuild);
exports.zip = zip;



// ----- Serve tasks ------
let filesToServe = [`${paths.temp}`, `${paths.src}`];
if (envProduction) filesToServe = [`${paths.dest}`];


const startServer = function() {
  server.init({
    notify: false,
    ghostMode: false,
    port: 9000,
    server: {
      baseDir: filesToServe,
      routes: {
        '/node_modules': 'node_modules'
      },
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });

  if (!envProduction) {
    watch([
      `${paths.src}/images/**/*`,
      `${paths.src}/fonts/**/*`
    ]).on('change', server.reload);

    watch([`${paths.src}/**/*.html`, `${paths.src}/data/**/*.json`], markup);
    watch(`${paths.src}/**/*.scss`, styles);
    
    watch([`${paths.src}/**/*.js`, `!${paths.src}/banners/*/*/scripts/*.js`], allScripts);
    watch(`${paths.src}/banners/*/*/scripts/*.js`, series(scripts, replaceBannerVariablesScripts)); 

    watch(`${paths.src}/top-level/**/*`, topLevel);
  }
}


let serve = series(compile, startServer);
if (envProduction) {
  serve = series(build, startServer);
}

exports.serve = serve;
