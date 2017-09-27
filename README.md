# babel-plugin-import-static-files
Transforms static files import and copy files to /static folder for next.js applications. 
This plugin is based on [babel-plugin-transform-assets-import-to-string](https://github.com/yeojz/babel-plugin-transform-assets-import-to-string), I just added copy functionality. 
Original plugin's functionality is still working.

## Table of Contents

-   [About](#about)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [via babelrc](#via-babelrc)
    -   [via Node API](#via-node-api)

## About

This [babel](https://babeljs.io/) plugin allows you to transform asset files into a string uri, allowing you to point your assets to CDN or other hosts, without needing to run your code through module bundlers.

This helps when doing _isomorphic_ / server-rendered applications.

```js
import image from './path/to/icon.png';
const image1 = require('./path/to/icon.svg');

// icon.png and icon.svg will be copied to project's root under static folder
// and code will be transformed to:

const image = '/static/path/to/icon.png';
const image1 = '/static/path/to/icon.svg';

// Somewhere further down in your code:
//
// eg: JSX
// <img src={image} alt='' />
//
// eg: Other cases
// ajaxAsyncRequest(image)
```

See the spec for more [examples](https://github.com/ahalimkara/babel-plugin-import-static-files/blob/master/test/index.spec.js).

## Installation

```
$> npm install babel-plugin-import-static-files --save
```

## Usage

### via .babelrc
```json
{
  "plugins": ["import-static-files"]
}
```
or if you will use cdn
```json
{
  "plugins": [
    [
      "import-static-files", 
      {
        "baseDir": "/static",
        "baseUri": "http://your.cdn.address"
      }
    ]
  ]
}
```

### via Node API

```js
require("babel-core").transform("code", {
  plugins: ["import-static-files"]
});
```

By default, it will transform the following extensions: `.gif, .jpeg, .jpg, .png, .svg` if `extensions` option is not defined. To configure a custom list, just add the `extensions` array as an option.

__Note:__ leading `.` (dot) is required.

```json
{
  "plugins": [
    ["import-static-files", {
      "extensions": [".jpg", ".png"]
    }]
  ]
}
```

## License

`babel-plugin-import-static-files` is [MIT licensed](./LICENSE)
