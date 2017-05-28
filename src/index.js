import {dirname, extname, resolve} from'path';
import transform from './transform';

export const defaultOptions = {
  extensions: [
    '.gif',
    '.jpeg',
    '.jpg',
    '.png',
    '.svg'
  ]
}

const applyTransform = (p, t, state, value, calleeName) => {
  const ext = extname(value);
  const options = Object.assign({}, defaultOptions, state.opts);


  if (options.extensions && options.extensions.indexOf(ext) >= 0) {
    const dir = dirname(resolve(state.file.opts.filename));
    const absPath = resolve(dir, value);
    transform(p, t, options, absPath, calleeName);
  }
}

export function transformImportsInline({types: t}) {
  return {
    visitor: {
      ImportDeclaration(p, state) {
        applyTransform(p, t, state, p.node.source.value, 'import');
      },
      CallExpression(p, state) {
        const callee = p.get('callee');
        if (!callee.isIdentifier() || !callee.equals('name', 'require')) {
          return;
        }

        const arg = p.get('arguments')[0];
        if (!arg || !arg.isStringLiteral()) {
          return;
        }

        applyTransform(p, t, state, arg.node.value, 'require');
      }
    }
  }
}

export default transformImportsInline;
