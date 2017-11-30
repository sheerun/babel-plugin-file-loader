# babel-plugin-file-loader [![CircleCI](https://circleci.com/gh/sheerun/babel-plugin-file-loader/tree/master.svg?style=svg)](https://circleci.com/gh/sheerun/babel-plugin-file-loader/tree/master) [![npm][npm-badge]][npm-link]

Works the same as Webpack's [file-loader](https://github.com/webpack-contrib/file-loader/), but on server side. With 95% test coverage!

## Installation

```
npm install babel-plugin-file-loader --save
```

```
yarn add babel-plugin-file-loader
```

Then put following "file-loader" as plugin in .babelrc:

```json
{
  "plugins": ["file-loader"]
}
```

This is equivalent to following default configuration:

```json
{
  "plugins": [
    [
      "file-loader",
      {
        "name": "[hash].[ext]",
        "extensions": ["png", "jpg", "jpeg", "gif", "svg"],
        "publicPath": "/public",
        "outputPath": "/public",
        "context": ""
      }
    ]
  ]
}
```

## How it works

Algorithms is as follows:

1. Select all imports and requires that end with one of `"extensions"`
2. Calculate `$NAME` of resource by substituting `"name"`'s placeholders (`[path]` is calculated relative to `"context"`)
3. Copy resource into `$ROOT/outputPath/$NAME` where `$ROOT` is `.babelrc` location.
3. Replace import and require in code with `publicPath/$NAME` string

## Usage

```js
import img from './file.png'
```

Puts `0dcbbaa7013869e351f.png` in the `outputPath` and replaces code to:

```
const img = "/public/0dcbbaa7013869e351f.png"
```

## Options

### outputPath

Tells where to put static files. By default it's `"/public"`.

This path is relative to the root of project.

### publicPath

Tells what prefix to output in the source. By default it's `"/public"` as well but it can be even full url, like so: `"http://cdn.example.com/foobar/"`

In this case the resulting code is:

```
const img = "http://cdn.example.com/foobar/0dcbbaa7013869e351f.png"
```

### name

The default is `[hash].[ext]` where:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`[ext]`**|`{String}`|`file.extname`|The extension of the resource|
|**`[name]`**|`{String}`|`file.basename`|The basename of the resource|
|**`[path]`**|`{String}`|`file.dirname`|The path of the resource relative to the `context`|
|**`[hash]`**|`{String}`|`md5`|The hash of the content, see below for more info|

#### [hash]

The format is: `[<hashType>:hash:<digestType>:<length>]` where:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`hashType`**|`{String}`|`md5`|`sha1`, `md5`, `sha256`, `sha512`|
|**`digestType`**|`{String}`|`base64`|`hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`|
|**`length`**|`{Number}`|`128`|The length in chars|

For example: `[md5:hash:base58:8]` or `[hash:base36]`.

### extensions

List of extension file-loader should look for in imports. All other imports are ignored.

## Contributing

Yes, please!

## License

[MIT](./LICENSE)

[npm-badge]: https://img.shields.io/npm/v/babel-plugin-file-loader.svg?style=flat-square
[npm-link]: https://www.npmjs.com/package/babel-plugin-file-loader
