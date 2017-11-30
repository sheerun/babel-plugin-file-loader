# babel-plugin-file-loader [![CircleCI](https://circleci.com/gh/sheerun/babel-plugin-file-loader/tree/master.svg?style=svg)](https://circleci.com/gh/sheerun/babel-plugin-file-loader/tree/master) [![npm][npm-badge]][npm-link]

Works the same as Webpack's [file-loader](https://github.com/webpack-contrib/file-loader/), but on server side. With 95% test coverage!

## Installation

```
npm install babel-plugin-file-loader --save
```

and then put following "file-loader" as plugin in .babelrc:

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

1. Select all improrts/requires that end with one of `extensions`
2. Calculate `NAME` of resource by substituting `name` placeholders (`[path]` is calculated relative to `context`)
3. Copy resource into `PROJECT_ROOT/outputPath/NAME`
3. Replace import/require in code with `publicPath/NAME` string

## Usage

```js
import img from './file.png'
```

Emits `file.png` as file in the output path and returns the public path.

```
"/public/0dcbbaa7013869e351f.png"
```


By default the filename of the resulting file is the MD5 hash of the file's contents with the original extension of the required resource. You can change it by setting "name" parameter. You can use any of placeholders and hashes described further in the README:

```json
{
  "plugins": [
    [
      "file-loader",
      {
        "name": "[path][name].[ext]"
      }
    ]
  ]
}
```

By default, it will transform the following extensions: `.gif, .jpeg, .jpg, .png, .svg` if `extensions` option is not defined. To configure a custom list, just add the `extensions` array as an option.

```json
  "plugins": [
    [
      "file-loader",
      {
        "extensions": ["png", "jpg", "gif"]
      }
    ]
  ]
```

### `placeholders`

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`[ext]`**|`{String}`|`file.extname`|The extension of the resource|
|**`[name]`**|`{String}`|`file.basename`|The basename of the resource|
|**`[path]`**|`{String}`|`file.dirname`|The path of the resource relative to the `context`|
|**`[hash]`**|`{String}`|`md5`|The hash of the content, hashes below for more info|

### `hashes`

`[<hashType>:hash:<digestType>:<length>]` optionally you can configure

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`hashType`**|`{String}`|`md5`|`sha1`, `md5`, `sha256`, `sha512`|
|**`digestType`**|`{String}`|`base64`|`hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`|
|**`length`**|`{Number}`|`128`|The length in chars|

## License

`babel-plugin-file-loader` is [MIT licensed](./LICENSE)

[npm-badge]: https://img.shields.io/npm/v/babel-plugin-file-loader.svg?style=flat-square
[npm-link]: https://www.npmjs.com/package/babel-plugin-file-loader
