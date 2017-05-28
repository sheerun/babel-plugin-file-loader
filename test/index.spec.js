import path from 'path';
import {expect} from 'chai';
import transformCode from './transformCode';

function getFixtures(name) {
  return path.resolve(__dirname, 'fixtures', name);
}

describe('index', function () {
  const baseConfig = {
    baseUri: 'http://cdn.address',
    baseDir: '/assets'
  }

  it('should replace import statements with uri', function () {
    const result = transformCode(getFixtures('import-image.js'), baseConfig).code;
    expect(result).to.equal('const test = \'http://cdn.address/assets/path/to/icon.svg\';');
  });

  it('should replace import statements with uri and hash of content', function () {
    const config = Object.assign({}, baseConfig, {
      hash: 1,
      baseDir: '/'
    });
    const result = transformCode(getFixtures('import-uri-hash.js'), config).code;
    expect(result).to.equal('const test = \'http://cdn.address/icon.svg?57e1ea98\';');
  });

  it('should replace import statements with uri when base uri and dir not defined', function () {
    const result = transformCode(getFixtures('import-image.js')).code;
    expect(result).to.equal('const test = \'icon.svg\';');
  });

  it('should replace import statements with uri when base dir not defined', function () {
    const result = transformCode(getFixtures('import-image.js'), {
      baseUri: baseConfig.baseUri
    }).code;
    expect(result).to.equal('const test = \'http://cdn.address/icon.svg\';');
  });

  it('should replace require statements with uri', function () {
    const result = transformCode(getFixtures('require-image.js'), baseConfig).code;
    expect(result).to.equal('const test = \'http://cdn.address/assets/path/to/icon.svg\';');
  });

  it('should do nothing when imports have no extensions', function () {
    const result = transformCode(getFixtures('import-no-ext.js')).code;
    expect(result).to.equal('import test from \'something\';');
  });

  it('should do nothing when require have no extensions', function () {
    const result = transformCode(getFixtures('require-no-ext.js')).code;
    expect(result).to.equal('const test = require(\'something\');');
  });

  it('should do nothing when not a require assignment', function () {
    const result = transformCode(getFixtures('require-var.js')).code;
    expect(result).to.equal('const test = \'something\';');
  });
});
