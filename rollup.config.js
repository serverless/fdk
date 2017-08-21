/* eslint-disable import/no-extraneous-dependencies, node/no-unpublished-require */
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const uglify = require('rollup-plugin-uglify')

// eslint-disable-next-line no-console
console.log('Creating bundle...')

const targets = [{ dest: 'dist/fdk.min.js', format: 'umd' }]

const plugins = [
  json(),
  resolve({ jsnext: true, main: true, preferBuiltins: false }),
  commonjs(),
  globals(),
  builtins(),
  babel({
    babelrc: false,
    presets: [['env', { modules: false }]],
  }),
  uglify(),
]

module.exports = {
  entry: 'index.js',
  moduleName: 'fdk',
  exports: 'named',
  targets,
  plugins,
}
