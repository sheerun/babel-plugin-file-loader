const { dirname, extname, resolve } = require('path')
const transform = require('./transform')

const defaultOptions = {
  name: '[hash].[ext]',
  outputPath: '/public',
  publicPath: '/public',
  context: '',
  extensions: ['gif', 'jpeg', 'jpg', 'png', 'svg'],
  limit: 0
}

const getVariableName = p => {
  if (p.node.specifiers && p.node.specifiers[0] && p.node.specifiers[0].local) {
    return p.node.specifiers[0].local.name
  }
}

const applyTransform = (p, t, state, value, calleeName) => {
  const ext = extname(value)
  const options = Object.assign({}, defaultOptions, state.opts)

  if (options.extensions && options.extensions.indexOf(ext.slice(1)) >= 0) {
    try {
      const rootPath = state.file.opts.sourceRoot || process.cwd()
      const scriptDirectory = dirname(resolve(state.file.opts.filename))
      const filePath = resolve(scriptDirectory, value)

      const uri = transform(rootPath, filePath, options)

      if (calleeName === 'require') {
        p.replaceWith(t.StringLiteral(uri))
        return
      }

      const variableName = getVariableName(p)

      if (!variableName) {
        throw new Error('Cannot determine variable name to assign to')
      }

      p.replaceWith(
        t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier(variableName), t.stringLiteral(uri))
        ])
      )
    } catch (e) {
      throw p.buildCodeFrameError(e.message)
    }
  }
}

function transformImportsInline ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration (p, state) {
        applyTransform(p, t, state, p.node.source.value, 'import')
      },
      CallExpression (p, state) {
        const callee = p.get('callee')
        if (!callee.isIdentifier() || !callee.equals('name', 'require')) {
          return
        }

        const arg = p.get('arguments')[0]
        if (!arg || !arg.isStringLiteral()) {
          return
        }

        applyTransform(p, t, state, arg.node.value, 'require')
      }
    }
  }
}

module.exports = transformImportsInline
module.exports.transformImportsInline = transformImportsInline
