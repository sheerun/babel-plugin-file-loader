import path from 'path';
import rimraf from 'rimraf';
import fs from 'fs';
import transformCode from './transformCode';

function getFixtures(name) {
  return path.resolve(__dirname, 'fixtures', name);
}

describe('index', () => {
  beforeEach(() => {
    rimraf.sync(path.join(__dirname, 'public'));
  });

  it('replaces import statements with uri', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {}).code;
    expect(result).toMatchSnapshot();
  });

  it('handles custom import path', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      publicPath: '/static',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles custom import path with trailing slash', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      publicPath: '/static/',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles custom name', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles custom context', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      context: '/test',
      name: '[path][name].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles custom context v2', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      context: '/test/assets',
      name: '[path][name].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles name with custom hash length', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:8].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles sha1 hash', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[sha1:hash].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles sha256 hash', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[sha256:hash].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles sha512 hash', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[sha512:hash].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles hex digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:hex].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base26 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base26].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base32 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base32].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base36 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base36].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base49 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base49].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base52 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base52].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base58 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base58].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base62 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base62].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles base64 digest', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[hash:base64].[ext]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles hash as query param', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]?[hash:8]',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('handles full url as publicPath as query param', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-image.js'), {
      publicPath: 'https://cdn.example.com/project',
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('should throw an error when resource does not exist', () => {
    expect.assertions(1);
    expect(() => {
      transformCode(getFixtures('import-not-existing.js'));
    }).toThrow(/File does not exist/);
  });

  it('should replace require statements with uri', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('require-image.js'), {}).code;
    expect(result).toMatchSnapshot();
  });

  it('should replace require statements even without assignment', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('require-no-var.js'), {}).code;
    expect(result).toMatchSnapshot();
  });

  it('should replace require statements in react components', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('require-react.js'), {}).code;
    expect(result).toMatchSnapshot();
  });

  it('should do nothing when imports have no extensions', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-no-ext.js')).code;
    expect(result).toMatchSnapshot();
  });

  it('should do nothing when require have no extensions', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('require-no-ext.js')).code;
    expect(result).toMatchSnapshot();
  });

  it('should do nothing when not a require assignment', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('require-var.js')).code;
    expect(result).toMatchSnapshot();
  });

  it('outputs file in outputPath', () => {
    expect.assertions(1);
    transformCode(getFixtures('import-image.js'));
    expect(
      fs.existsSync(
        path.resolve(__dirname, './public/9c87cbf3ba33126ffd25ae7f2f6bbafb.png'),
      ),
    ).toEqual(true);
  });

  it('doesnt output file when outputPath is null', () => {
    expect.assertions(1);
    transformCode(getFixtures('import-image.js'), { outputPath: null });
    expect(
      fs.existsSync(
        path.resolve(__dirname, './public'),
      ),
    ).toEqual(false);
  });

  it('outputs file in outputPath, nested', () => {
    expect.assertions(1);
    transformCode(getFixtures('import-image.js'), {
      name: '/foo/bar/[hash].[ext]',
    });
    expect(
      fs.existsSync(
        path.resolve(
          __dirname,
          './public/foo/bar/9c87cbf3ba33126ffd25ae7f2f6bbafb.png',
        ),
      ),
    ).toEqual(true);
  });

  it('outputs file in outputPath, full path', () => {
    expect.assertions(1);
    transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]',
    });
    expect(
      fs.existsSync(path.resolve(__dirname, './public/test/assets/file.png')),
    ).toEqual(true);
  });

  it('outputs file in outputPath, ignore query', () => {
    expect.assertions(1);
    transformCode(getFixtures('import-image.js'), {
      name: '[path][name].[ext]?asdfas',
    });
    expect(
      fs.existsSync(path.resolve(__dirname, './public/test/assets/file.png')),
    ).toEqual(true);
  });

  it('inlines file when the length in lower then the limit', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-text.js'), {
      extensions: ['txt'],
      name: '[path][name].[ext]',
      limit: 6,
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('doesnt output the file when its inlined', () => {
    expect.assertions(1);
    transformCode(getFixtures('import-text.js'), {
      extensions: ['txt'],
      name: '[path][name].[ext]',
      limit: 6,
    });
    expect(
      fs.existsSync(path.resolve(__dirname, './public')),
    ).toEqual(false);
  });

  it('doesnt inline file when the length equals the limit', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-text.js'), {
      extensions: ['txt'],
      name: '[path][name].[ext]',
      limit: 5,
    }).code;
    expect(result).toMatchSnapshot();
  });

  it('ouputs the file when the length equals the limit', () => {
    expect.assertions(1);
    transformCode(getFixtures('import-text.js'), {
      extensions: ['txt'],
      name: '[path][name].[ext]',
      limit: 5,
    });
    expect(
      fs.existsSync(path.resolve(__dirname, './public/test/assets/file.txt')),
    ).toEqual(true);
  });

  it('inline file with an unknown type by not specifying mime type', () => {
    expect.assertions(1);
    const result = transformCode(getFixtures('import-unknown.js'), {
      extensions: ['unknown'],
      name: '[path][name].[ext]',
      limit: 6,
    }).code;
    expect(result).toMatchSnapshot();
  });
});
