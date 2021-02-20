/* eslint-disable no-param-reassign */
const { override, fixBabelImports, overrideDevServer } = require('customize-cra');
const { name } = require('./package.json');

const QianKunConfig = () => (config) => {
  config.output.library = `${name}-[name]`;
  config.output.libraryTarget = 'umd';
  config.output.jsonpFunction = `webpackJsonp_${name}`;
  config.output.globalObject = 'window';
  return config;
};

const devServerConfig = () => (config) => {
  config.port = 3001;
  config.headers = {
    'Access-Control-Allow-Origin': '*',
  };
  config.historyApiFallback = true;
  config.hot = false;
  config.watchContentBase = false;
  config.liveReload = false;

  return {
    ...config,
  };
};

module.exports = {
  webpack: override(
    QianKunConfig(),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }),
  ),
  devServer: overrideDevServer(devServerConfig()),
};
