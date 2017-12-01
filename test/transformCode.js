import path from 'path'
import { transformFileSync } from 'babel-core'

const plugin = path.join(path.resolve(__dirname, '..', 'src'), 'index.js')

const transformCode = (file, config = {}) => {
  const babelOptions = {
    babelrc: false,
    presets: ["react"],
    plugins: [[plugin, Object.assign({ outputPath: '/test/public' }, config)]]
  }
  return transformFileSync(file, babelOptions)
}

export default transformCode
