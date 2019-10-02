const path = require('path')
const { transformFileSync } = require('@babel/core')

const plugin = path.join(path.resolve(__dirname, '..', 'src'), 'index.js')

const transformCode = (file, config = {}) => {
  const babelOptions = {
    babelrc: false,
    presets: ['@babel/preset-react'],
    plugins: [[plugin, Object.assign({ outputPath: '/test/public' }, config)]]
  }
  return transformFileSync(file, babelOptions)
}

module.exports = transformCode
