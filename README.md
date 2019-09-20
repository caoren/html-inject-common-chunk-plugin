# html-inject-common-chunk-plugin

A webpack Plugin. It must be used after [html-webpack-plugin] (https://github.com/jantimon/html-webpack-plugin)


<p>
    <a href="https://www.npmjs.com/package/html-inject-common-chunk-plugin"><img src="https://img.shields.io/npm/v/html-inject-common-chunk-plugin.svg?style=flat"></a>
    <a href="https://www.npmjs.com/package/html-inject-common-chunk-plugin"><img src="https://img.shields.io/npm/dm/html-inject-common-chunk-plugin.svg?style=flat"></a>
    <a href="https://travis-ci.org/caoren/html-inject-common-chunk-plugin"><img src="https://img.shields.io/travis/caoren/html-inject-common-chunk-plugin/master.svg?style=flat"></a>
    <a href='https://coveralls.io/github/caoren/html-inject-common-chunk-plugin?branch=master'><img src='https://coveralls.io/repos/github/caoren/html-inject-common-chunk-plugin/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>


After using webpack4 splikChunk, the public chunk name is dynamically generated, so the `html-webpack-plugin` cannot insert the corresponding chunk into the html template. This plugin is to solve this problem


## Installation

```javascript
npm install html-webpack-plugin  --save-dev
npm install html-inject-common-chunk-plugin  --save-dev
```

webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectCommonChunk = require('html-inject-common-chunk-plugin');

module.exports = {
    ...
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../htmlprod/index.html',
            template: './htmltpl/index.html',
            chunks: ['index']
        }),
        new InjectCommonChunk()
    ]
};
