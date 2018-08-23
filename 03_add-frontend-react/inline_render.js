const fs = require('fs')
const glob = require('glob')

const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'))

// replaces any { modules: false } with { modules: 'commonjs' }
// to allow babel to handle import/export from
const replaceModulesOpts = (obj, replace) => {
  if (Array.isArray(obj)) {
    for (const prop of obj) {
      replaceModulesOpts(prop, replace)
    }
  } else if (typeof obj === 'object') {
    if (obj.modules !== undefined && obj.modules !== replace) obj.modules = replace
    else {
      for (const key of Object.keys(obj)) {
        replaceModulesOpts(obj[key], replace)
      }
    }
  }
}

replaceModulesOpts(babelrc, 'commonjs')

if (!babelrc.plugins) babelrc.plugins = []

babelrc.plugins.push(['import-redirect',
  {
    redirect: {
      '[\\\\/]src[\\\\/]api[\\\\/](?!utils)': {},
    },
  }])

require('@babel/register')({
  babelrc: false,
  ...babelrc,
})
const React = require('react')
const ReactDOMServer = require('react-dom/server')

const App = require('./src/App.jsx').default

// gather absolute filepaths to files in ./src except for in ./src/api/utils
const dependencies = glob.sync('./src/**/*', { nodir: true, absolute: true, ignore: './src/api/!(utils)' })

module.exports = function render() {
  return {
    code: ReactDOMServer.renderToString(React.createElement(App)),
    // when dependencies change cache-loader recreates the cached bundle
    dependencies,
  }
}
