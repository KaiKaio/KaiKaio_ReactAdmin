/* eslint-disable no-param-reassign */
const { override, fixBabelImports, addWebpackPlugin, overrideDevServer } = require('customize-cra');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
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
    addWebpackPlugin(
      new MomentLocalesPlugin({
        localesToKeep: ['es-us', 'zh-cn'], // 只保留你需要的语言包
      })
    ),
    QianKunConfig(),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }),
  ),
  devServer: overrideDevServer(devServerConfig()),
};
