// // Sets up a banner project for flashtalking
// // npm run setupFlashtalking

// const paths = {
//   src: 'src',
//   dest: 'build',
//   tmp: '.tmp',
//   zip: 'zip',
//   gulp: './tasks/gulp',
//   ft : '_FT'
// };


// const fs = require("fs")
// const path = require("path")


// // https://stackoverflow.com/a/22185855

// const copyRecursiveSync = function(src, dest) {
//   const exists = fs.existsSync(src);
//   const stats = exists && fs.statSync(src);
//   const isDirectory = exists && stats.isDirectory();

//   if (isDirectory) {
//     if (!fs.existsSync(dest)) fs.mkdirSync(dest);
//     fs.readdirSync(src).forEach(function(childItemName) {
//       copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
//     });
//   } else {
//     fs.copyFileSync(src, dest);
//   }

//   console.log('\x1b[32m Flashtalking setup complete. \x1b[0m\n');
// };


// copyRecursiveSync(`${paths.src}/layouts/test-input`, `${paths.src}/test-output`);





// Sets up a banner project for flashtalking
// npm run setupFlashtalking

const fs = require("fs")
// const path = require("path")

const srcPath = './src';

const removeFTImports = function(filePath) {
  fs.readFile(filePath, 'utf8', (error, fileData) => {
    if (error) return console.log(error);

    let updatedData = 
    fileData.replace(new RegExp('// @import \'_o2-bubbles\';', 'g'), '@import \'_o2-bubbles\';')
    .replace(new RegExp('// @import \'_o2-fonts\';', 'g'), '@import \'_o2-fonts\';')
    .replace(new RegExp('// import { bubbles }', 'g'), 'import { bubbles }')
    .replace(new RegExp('// bubbles', 'g'), 'bubbles')
    .replace(new RegExp('// --banner-bg-gradient:', 'g'), '--banner-bg-gradient:');

    fs.writeFile(filePath, updatedData, 'utf8', (error) => {
      if (error) {
        return console.log(error);
      }
    });
  });
};


const init = function() {
  // removeFTImports(`${srcPath}/styles/_global.scss`);
  // removeFTImports(`${srcPath}/styles/_variables.scss`);
  removeFTImports(`${srcPath}/scripts/main.js`);
  console.log('\x1b[32m Flashtalking setup complete. \x1b[0m\n');
}

init();
