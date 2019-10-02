const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const mime = require('mime')

const baseEncodeTables = {
  26: 'abcdefghijklmnopqrstuvwxyz',
  32: '123456789abcdefghjkmnpqrstuvwxyz', // no 0lio
  36: '0123456789abcdefghijklmnopqrstuvwxyz',
  49: 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', // no lIO
  52: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  58: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', // no 0lIO
  62: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  64: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
}

function encodeBufferToBase (buffer, base) {
  const encodeTable = baseEncodeTables[base]
  if (!encodeTable) throw new Error('Unknown encoding base' + base)

  const readLength = buffer.length

  const Big = require('big.js')
  Big.RM = Big.DP = 0
  let b = new Big(0)
  for (let i = readLength - 1; i >= 0; i--) {
    b = b.times(256).plus(buffer[i])
  }

  let output = ''
  while (b.gt(0)) {
    output = encodeTable[b.mod(base)] + output
    b = b.div(base)
  }

  Big.DP = 20
  Big.RM = 1

  return output
}

function hash (contents, hashName, digestType, maxLength) {
  hashName = hashName || 'md5'
  maxLength = maxLength || 128

  const hasher = crypto.createHash(hashName).update(contents)

  if (
    digestType === 'base26' ||
    digestType === 'base32' ||
    digestType === 'base36' ||
    digestType === 'base49' ||
    digestType === 'base52' ||
    digestType === 'base58' ||
    digestType === 'base62' ||
    digestType === 'base64'
  ) {
    return encodeBufferToBase(hasher.digest(), digestType.substr(4)).substr(
      0,
      maxLength
    )
  } else {
    return hasher.digest(digestType || 'hex').substr(0, maxLength)
  }
}

function transform (rootPath, filePath, opts) {
  let url = opts.name
  let ext = 'bin'
  let basename = 'file'
  let directory = ''
  const outputPath = opts.outputPath
  const publicPath = opts.publicPath.replace(/\/$/, '')
  const context =
    opts.context[0] === '/' ? opts.context.substr(1) : opts.context
  const limit = opts.limit
  const contextPath = path.resolve(rootPath, context)

  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist')
  }

  const parsed = path.parse(filePath)

  if (parsed.ext) {
    ext = parsed.ext.substr(1)
  }

  let basePath

  if (parsed.dir) {
    basename = parsed.name
    basePath = parsed.dir + path.sep
  }

  directory = path
    .relative(contextPath, basePath + '_')
    .replace(/\\/g, '/')
    .replace(/\.\.(\/)?/g, '_$1')
  directory = directory.substr(0, directory.length - 1)

  url = url
    .replace(/\[ext\]/gi, () => ext)
    .replace(/\[name\]/gi, () => basename)
    .replace(/\[path\]/gi, () => directory)

  const contents = fs.readFileSync(filePath)
  if (contents.length < limit) {
    const src = Buffer.from(contents)
    const mimetype = mime.getType(filePath) || ''
    return `data:${mimetype};base64,${src.toString('base64')}`
  }

  url = url.replace(
    /\[(?:([^:]+):)?hash(?::([a-z]+\d*))?(?::(\d+))?\]/gi,
    (_, hashType, digestType, maxLength) =>
      hash(contents, hashType, digestType, parseInt(maxLength, 10))
  )

  if (outputPath !== null) {
    fs.copySync(filePath, path.join(rootPath, outputPath, url.split('?')[0]))
  }

  return publicPath + '/' + url
}

module.exports = transform
