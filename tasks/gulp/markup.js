const handleErrors = require('./errors');
const fs = require('fs');

module.exports = function({ src, dest }, $, paths, envProduction, server, envDeploy) {

  const { replaceBannerVariables, allVersionDirs, allSizeDirs, getVersionDir, getSizeDir } = require('./shared.js')($, paths);

  const requireUncached = function requireUncached(module) {
    delete require.cache[require.resolve(`../../${module}`)];
    return require(`../../${module}`);
  };


  const markup = function() {

    return src([`${paths.src}/*.html`, `${paths.src}/banners/**/*/*.html`])

      .pipe($.flatmap(function(stream, file) {
        return replaceBannerVariables(stream, file);
      }))

      .pipe($.replace('$allVersionDirs', allVersionDirs))
      .pipe($.replace('$allSizeDirs', allSizeDirs))

      .pipe($.data(() => {
        return requireUncached(`${paths.src}/data/data.json`);
      }))
      .pipe($.nunjucksRender({
        path: `${paths.src}`,
        // path: [paths.temp, paths.src],
        manageEnv: manageEnvironment
      }))
      .on('error', handleErrors)

      .pipe(dest(`${paths.temp}`))
      .pipe(server.reload({ stream: true }));
  };
  

  const createFTFiles = function() {

    const data = requireUncached(`${paths.src}/data/data.json`)['data'];

    return src(allSizeDirs)
      .pipe($.flatmap(function(stream, file) {

        const versionDir = getVersionDir(file);
        const sizeDir = getSizeDir(file);
        const sizes = sizeDir.split('x');
        // console.log(sizes[0])

        const bannerData =  { 
          version: versionDir,
          size: sizeDir,
          width: sizes[0],
          height: sizes[1]
        };
        
        let globalData = data['default'];
        let versionData = data[versionDir]['default'];
        let sizeData = data[versionDir][sizeDir];

        let mergedData = Object.assign({}, globalData, versionData, sizeData);
        // console.log(sizeDir, mergedData);

        let transformedData = { 
          'filename': 'index.html',
          'richLoads': [{ 'name': 'iRichload', 'src': `${bannerData.version}_${bannerData.size}` }],
          'width': bannerData.width, 'height': bannerData.height, 
          'clickTagCount': 1, 
          'hideBrowsers':['ie'], 
          'instantAds': [
            {'name': 'iRichload', 'type': 'richload', 'default': '' }
          ] 
        };
        
        const replaceBannerVariables = function(item) {
          item = item.replace('$bannerVersion', bannerData.version);
          item = item.replace('$bannerSize', bannerData.size);
          item = item.replace('$bannerWidth', bannerData.width);
          item = item.replace('$bannerHeight', bannerData.height);
          return item;
        }


        for (const property in mergedData) {
          let propertyValue = mergedData[property];
          let imageTest = property.startsWith('img_') || propertyValue.match(new RegExp(/[^/]+(jpg|jpeg|png|gif|svg|webp)$/));
          if (imageTest && propertyValue === '') propertyValue = 'empty.png';

          let currentObject = {
            'name': property,
            'default': replaceBannerVariables(propertyValue),
            'type': imageTest ? 'image' : 'text'
          };
          transformedData['instantAds'].push(currentObject);
        }
        // console.log(transformedData);

        let fileManifest = `FT.manifest( ${ JSON.stringify(transformedData)} );`;
        let fileBase = '<!DOCTYPE html><html><head></head><body><ft-default><ft-richload name="iRichload" id="iRichload"></ft-richload></ft-default><script src="http://cdn.flashtalking.com/frameworks/js/api/2/10/html5API.js"></script></body></html>';
        let FTFilePath = `${paths.dest}/${versionDir}${paths.ft}_Creative/${sizeDir}`;
        
        if (envProduction && !envDeploy) {
          if (!fs.existsSync(`${FTFilePath}`)) {
            fs.mkdirSync(`${FTFilePath}`, { recursive: true });
          } 

          fs.writeFileSync(`${FTFilePath}/manifest.js`, fileManifest);
          fs.writeFileSync(`${FTFilePath}/index.html`, fileBase);
        }
        else {
          fs.writeFileSync(`${paths.temp}/${versionDir}/${sizeDir}/manifest.js`, fileManifest);
        }

        return stream;

      }));
  };


  return {
    markup,
    createFTFiles
  };

};


// Custom filters for nunjucks
const manageEnvironment = function(environment) {

  environment.addGlobal('envProduction', process.env.NODE_ENV === 'production');
  environment.addGlobal('envDeploy', process.env.DEPLOY === 'true'); 
  environment.addGlobal('envBannerType', process.env.BANNER_TYPE); 

  // Generate banner links for landing page
  const makeBannerLinkObject = item => {
    const itemDataArray = item.split('/');
    const sizes = itemDataArray[1].split('x');
    return { 
      link: item,
      version: itemDataArray[0],
      size: itemDataArray[1],
      width: sizes[0],
      height: sizes[1]
    };
  };

  environment.addFilter('bannerLinks', function(str) {
    const bannersString = str.replace(/src\/banners\//g, '');
    const bannersArray = bannersString.split(',');
    return bannersArray.map(makeBannerLinkObject);
  });  
  
  environment.addFilter('dashCaseToWords', function(text) {
    // let textReplace = text.replaceAll('-', ' ').replaceAll('_', ' ');
    let textReplace = text.replace('-', ' ').replace('-', ' ');
    return `${textReplace.charAt(0).toUpperCase()}${textReplace.substring(1)}`;
  });

};
