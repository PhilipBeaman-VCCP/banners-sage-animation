# Banners: Banner template for HTML, Google and Flashtalking


## Project Information
Preview: XXX  
Username: XXX  
Password: XXX  

Trello: XXX


----------
## Development

### Setup
`npm i`  
Edit the config.bannerType variable in the package.json to the banner type of this project(html, google, googlepolite, flashtalking).  
If it is a flashtalking banner run `npm run setupFlashtalking`.

### Development
`npm run dev`

### Preview
1. Committing to the main branch will trigger a preview build.
2. You can edit preview options in .github/workflows/vccp-preview.yml.
3. Check preview.vccp.com for the url and login for the preview.

### Build
`npm run build`

### Zip
`npm run zip`  
This will also run build first.

### Create a component
`npm run createComponent component-name`


----------
## Architecture

### Folder structure

```html
build <!-- Built code for release -->
src  <!-- Development source code -->
  |- banners <!-- Banner versions and sizes -->
    |- banner-version
        |- 300x250 <!-- Banner dimensions in width by height format -->
          |- images <!-- Size assets - Assets for this banner size only -->
          |- scripts
          |- styles
        ...
        |- images <!-- Version assets - Assets for all banners in this version -->
        |- scripts
        |- styles
  |- components <!-- Website components -->
    |- component-name
  |- data <!-- Data for the banner in JSON -->
  |- fonts
  |- images <!-- Global assets - Assets for all banners -->
  |- images-FT <!-- Images for Flashtalking -->
  |- layouts <!-- HTML templates -->
  |- scripts
    |- libs <!-- Third party libraries not processed by the build pipeline -->
    |- local <!-- Third party libraries for local development only -->
  |- styles
  |- top-level <!-- These files will compile to the top level folder e.g. favicons -->
tasks <!-- Build tasks -->
temp <!-- Temporary files e.g. compiled css -->
```

### Asset sharing
Assets (images and JS) are stored in different locations depending on how they should be shared with the banners. The examples below will use images as an example. 
- `src/images` Global assets that will be shared with every banner version and every banner size.
- `src/banners/banner-version/images` Assets for every size of this banner version.
- `src/banners/banner-version/300x250/images` Assets specific to this banner size.


----------
## Data

### Banner variables
There are a number of banner variables you can use in any files to access banner information, they will be replaced with the relevant data for that banner. These are $bannerVersion, $bannerSize, $bannerWidth and $bannerHeight.

### Data sharing
Data is shared by all banners, data can be global(data.default), for a specific banner version(data.banner-version.default) or a specific banner size(data.banner-version.000x000). 

```json
{
  "data": {

    "default": {
      "data_1": "Global data 1",
      "data_2": "Global data 2",
      "data_3": "Global data 3"
    },

    "banner-version" : {
      "preview": true,

      "default": {
        "data_2": "Version data"
      },

      "300x250": {
        "data_3": "Size data"
      }
    }

  }
}
```

For example the output for the 300x250 banner would be.
```json
{
  "data_1": "Global data 1",
  "data_2": "Version data",
  "data_3": "Size data"
}
```

----------
## Differences between HTML/Google banners and Flashtalking

The component 'componentElement' outputs the correct markup based on the banner type but you can also use the markup as below.  

### Markup
```html
<div class="text-1">{{ getData('text_1') }}</div>

<div class="text-1" data-ft=”text_1”></div>
```

### Images
Images that will be used as a variable in FT go into the src/images-FT folder. src/images can still be used for global assets in a FT banner.


----------
## Flashtalking 
To upload to Flashtalking go to the campaign. Click Asset manager, upload images from zip/images and then upload richloads from zip/banner-version. Close asset manager and click add creative and upload from zip/banner-version-FT_Creative.

### Adding versions
FT requires two versions of each banner, the easiest way to do this is to select all the banners, right click then select Export Versions. This gives you a spreadsheet to download. In the spreadsheet duplicate the rows for each banner and update the version name in the duplicated rows. In FT right click, select Import Versions FastTrack and select the spreadsheet file.

### Updating text in multiple banners/versions
Following the steps above and do a find/replace on the text in the spreadsheet then import back into FT.

----------
## Creating new sizes

### Sizing
In general it is best to develop the 300x250 first to establish the font sizings. Then in other sizes set the base font size e.g. html { font-size: 12px; }, higher or lower than 10px as needed.  
160x600 = 300x250  
120x600, 320x50, 320x100, 728x90 < 300x250  
300x600, 970x250 > 300x250

### Layouts
New sizes can usually be based on the template sizes as follows.  
300x250: 320x50, 320x100  
300x600: 120x600, 300x600  
