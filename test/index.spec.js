import path from 'path'
import { expect } from 'chai'
import transformCode from './transformCode'
import rimraf from 'rimraf'
import fs from 'fs'

function getFixtures (name) {
  return path.resolve(__dirname, 'fixtures', name)
}

describe('index', function () {
  beforeEach(function () {
    rimraf.sync(path.join(__dirname, 'public'))
  })

  it('replaces import statements with uri', function () {
    const result = transformCode(getFixtures('import-image.js'), {}).code
    expect(result).to.equal(
      `const test = '/public/9c87cbf3ba33126ffd25ae7f2f6bbafb.png';`
    )
  })

  it('handles custom import path', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      publicPath: '/static'
    }).code
    expect(result).to.equal(
      `const test = '/static/9c87cbf3ba33126ffd25ae7f2f6bbafb.png';`
    )
  })

  it('handles custom import path with trailing slash', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      publicPath: '/static/'
    }).code
    expect(result).to.equal(
      `const test = '/static/9c87cbf3ba33126ffd25ae7f2f6bbafb.png';`
    )
  })

  it('handles custom name', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]'
    }).code
    expect(result).to.equal(`const test = '/public/test/assets/file.png';`)
  })

  it('handles custom context', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      context: '/test',
      name: '[path][name].[ext]'
    }).code
    expect(result).to.equal(`const test = '/public/assets/file.png';`)
  })

  it('handles custom context v2', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      context: '/test/assets',
      name: '[path][name].[ext]'
    }).code
    expect(result).to.equal(`const test = '/public/file.png';`)
  })

  it('handles name with custom hash length', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:8].[ext]'
    }).code
    expect(result).to.equal(`const test = '/public/9c87cbf3.png';`)
  })

  it('handles sha1 hash', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[sha1:hash].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/f824ad7c5f655c81c88d3fe267fe5780055bced5.png';`
    )
  })

  it('handles sha256 hash', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[sha256:hash].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/77c741ac0a9070da1f3c85468cfd7a11532987ad1e9a04631d724629d33c31bb.png';`
    )
  })

  it('handles sha512 hash', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[sha512:hash].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/a72ac1286999e22d029054119627d677d6ad971132d81926c32284eb379c7f16094d1a0c2f7a281521ecbf6dbd03201b00c5120f985f531d0067b917b4f50709.png';`
    )
  })

  it('handles hex digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:hex].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/9c87cbf3ba33126ffd25ae7f2f6bbafb.png';`
    )
  })

  it('handles base26 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base26].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/ccjesbcwzsppzgsqtbnioeblcexw.png';`
    )
  })

  it('handles base32 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base32].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/8vrapkyzxf5ryqy5jmrctwr2ww.png';`
    )
  })

  it('handles base36 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base36].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/ewi6kgnxju4v6e6xs91ffh3mk.png';`
    )
  })

  it('handles base49 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base49].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/wUByBoCTfZTTYAcdFceBFjM.png';`
    )
  })

  it('handles base52 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base52].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/fVWKlApuFbbEMdlLegCqBlW.png';`
    )
  })

  it('handles base58 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base58].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/x5UajugYgSHCpqHbQXrw1d.png';`
    )
  })

  it('handles base62 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base62].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/7F0gARBRl8UjBzQkyqrDyY.png';`
    )
  })

  it('handles base64 digest', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base64].[ext]'
    }).code
    expect(result).to.equal(
      `const test = '/public/3XKCILvWUB_mYicXHPOUus.png';`
    )
  })

  it('handles hash as query param', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]?[hash:8]'
    }).code
    expect(result).to.equal(
      `const test = '/public/test/assets/file.png?9c87cbf3';`
    )
  })

  it('handles full url as publicPath as query param', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      publicPath: 'https://cdn.example.com/project'
    }).code
    expect(result).to.equal(
      `const test = 'https://cdn.example.com/project/9c87cbf3ba33126ffd25ae7f2f6bbafb.png';`
    )
  })

  it('should throw an error when resource does not exist', function () {
    expect(() => {
      transformCode(getFixtures('import-not-existing.js'))
    }).to.throw(/File does not exist/)
  })

  it('should replace require statements with uri', function () {
    const result = transformCode(getFixtures('require-image.js'), {}).code
    expect(result).to.equal(
      `const test = '/public/64eababb117f90535085779cc0325003.svg';`
    )
  })

  it('should do nothing when imports have no extensions', function () {
    const result = transformCode(getFixtures('import-no-ext.js')).code
    expect(result).to.equal(`import test from 'something';`)
  })

  it('should do nothing when require have no extensions', function () {
    const result = transformCode(getFixtures('require-no-ext.js')).code
    expect(result).to.equal(`const test = require('something');`)
  })

  it('should do nothing when not a require assignment', function () {
    const result = transformCode(getFixtures('require-var.js')).code
    expect(result).to.equal(`const test = 'something';`)
  })

  it('outputs file in outputPath', function () {
    const result = transformCode(getFixtures('import-image.js')).code
    expect(
      fs.existsSync(
        path.resolve(__dirname, './public/9c87cbf3ba33126ffd25ae7f2f6bbafb.png')
      )
    ).to.equal(true)
  })

  it('outputs file in outputPath, nested', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '/foo/bar/[hash].[ext]'
    }).code
    expect(
      fs.existsSync(
        path.resolve(
          __dirname,
          './public/foo/bar/9c87cbf3ba33126ffd25ae7f2f6bbafb.png'
        )
      )
    ).to.equal(true)
  })

  it('outputs file in outputPath, full path', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]'
    }).code
    expect(
      fs.existsSync(path.resolve(__dirname, './public/test/assets/file.png'))
    ).to.equal(true)
  })

  it('outputs file in outputPath, ignore query', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]?asdfas'
    }).code
    expect(
      fs.existsSync(path.resolve(__dirname, './public/test/assets/file.png'))
    ).to.equal(true)
  })
})
