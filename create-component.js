// Creates component files based on template, enter the component name in dash case.
// npm run createComponent component-name

const fs = require('fs');
const args = process.argv.slice(2);

if (args[0] === '' || args[0] === undefined) {
  console.log('\x1b[31m Provide a component name. \x1b[0m\n');
  return;
}

const dashToCamelCase = function(string) {
  return string.replace(/-([a-z,0-9])/g, (letter) => {
    return letter[1].toUpperCase();
  });
};

const capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const componentName = args[0].toLowerCase();
const componentNameCamelCase = dashToCamelCase(componentName);
const componentNameMacro = `component${capitalizeFirstLetter(componentNameCamelCase)}`;

const srcPath = './src';
const componentsPath = `${srcPath}/components`;
const componentNamePath = `${componentsPath}/${componentName}`;


const componentFiles = {
  'html': {
    'template': 
`{%- macro ${componentNameMacro}(elementClass = '', elementAttribute = '') -%}

  <div class="${componentName} {{ elementClass }}" {{ elementAttribute | safe }}>
    
  </div>

{%- endmacro -%}
`,
    'importFile': `${srcPath}/layouts/`,
    'importPlaceholder': '{# {{ componentPlaceholder }} #}',
    'importStatement': `{%- from "../components/${componentName}/${componentName}.html" import ${componentNameMacro} with context -%}`
  },

  'scss': {
    'template': 
`.${componentName} {
  
}
`,
    'importFile': `${srcPath}/styles/_global.scss`,
    'importPlaceholder': '\/\/ {{ componentPlaceholder }}',
    'importStatement': `@import "../components/${componentName}/_${componentName}\";`
  }
  
//   ,

//   'js': {
//     'template': 
// `const ${componentNameCamelCase} = function({
//     selector = '.${componentName}'
// 	} = {}) {

//   const element = document.querySelector(selector);



//   const init = function() {
//     if (element === null) return;
    
//   };
//   init();

//   return {
//     init
//   };

// };

// export default ${componentNameCamelCase};
// `,
//     'importFile': `${srcPath}/scripts/main.js`,
//     'importPlaceholder': '\/\/ {{ componentPlaceholder }}',
//     'importStatement': `import ${componentNameCamelCase} from \'../components/${componentName}/${componentName}.js\';`
//   }


};



// Methods
const replaceStringInFile = function(filePath, replaceString, newString) {
  fs.readFile(filePath, 'utf8', (error, fileData) => {
    if (error) return console.log(error);

    const regExp = new RegExp(replaceString, 'g');
    let updatedData = fileData.replace(regExp, `${newString}\n${replaceString}`);

    fs.writeFile(filePath, updatedData, 'utf8', (error) => {
      if (error) return console.log(error);
    });
  });
}

const updateFileImport = function(key) {
  let filePath = componentFiles[key]['importFile'];
  let replaceString = componentFiles[key]['importPlaceholder']
  let newString = componentFiles[key]['importStatement'];

  if (filePath.endsWith('/')) {
    fs.readdir(`${filePath}`, function(error, files) {
      if (error) return console.log(error);

      for (const item of files) {
        replaceStringInFile(`${filePath}${item}`, replaceString, newString);
      }
    });
  }
  else 
  {
    replaceStringInFile(filePath, replaceString, newString);
  };

}


const createComponent = function() {
  if (fs.existsSync(componentNamePath)) {
    console.log('\x1b[31m This component already exists. \x1b[0m\n');
    return;
  } 

  fs.mkdirSync(componentNamePath);

  for (const [key, value] of Object.entries(componentFiles)) {
    let fileName = (key === 'scss' ? `_${componentName}` : componentName) + `.${key}`;
    let filePath = `${componentNamePath}/${fileName}`;

    fs.writeFileSync(filePath, componentFiles[key]['template']);
    updateFileImport(key);
  }

  console.log('\x1b[32m Component created. \x1b[0m\n');
}


createComponent();
