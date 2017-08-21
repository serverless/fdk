/* eslint-disable import/no-extraneous-dependencies, node/no-unpublished-require */
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const uglify = require('rollup-plugin-uglify')
const visualizer = require('rollup-plugin-visualizer')

// eslint-disable-next-line no-console
console.log('Creating bundle...')

const targets = [{ dest: 'dist/fdk.min.js', format: 'umd' }]

const plugins = [
  json(),
  resolve({ jsnext: true, main: true, browser: true, preferBuiltins: false }),
  commonjs(),
  babel({
    babelrc: false,
    presets: [['env', { modules: false }]],
    plugins: ['external-helpers'],
  }),
  uglify(),
  visualizer(),
]

module.exports = {
  entry: 'index-browser.js',
  moduleName: 'fdk',
  exports: 'named',
  targets,
  plugins,
}
