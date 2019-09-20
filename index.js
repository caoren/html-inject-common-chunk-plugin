const uniq = require('lodash.uniq');

const filterJs = chunk => chunk.slice(-3) === '.js';
const filterCss = chunk => chunk.slice(-4) === '.css';
const mergeAssets = (source, merge) => {
    source.forEach((item, n) => {
        if (merge.indexOf(item) !== -1) {
            source[n] = null;
        }
    });
    const assets = source.concat(merge).filter(item => item !== null);
    // uniq
    return uniq(assets);
}
// get the corresponding assets by chunkName
const getAssets = (stats, chunkNames) => {
    const { namedChunkGroups = {}, publicPath } = stats;
    const addPublicPath = item => `${publicPath}${item}`;
    const allAssets = { js: [], css: [] };
    chunkNames.forEach((item) => {
        const curChunk = namedChunkGroups[item];
        if (curChunk) {
            const { assets } = curChunk;
            const pathAssets = assets.map(addPublicPath);
            allAssets.js = allAssets.js.concat(pathAssets.filter(filterJs));
            allAssets.css = allAssets.css.concat(pathAssets.filter(filterCss));
        }
    });
    return allAssets;
};
class InjectCommonChunk {
    apply(compiler) {
        compiler.hooks.compilation.tap('InjectCommonChunkPlugin', function (compilation) {
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync('InjectCommonChunkPlugin', function (htmlPluginData, cb) {
                const { assets, plugin } = htmlPluginData;
                const { chunks } = plugin.options;
                //if array continue
                if (Array.isArray(chunks)) {
                    // get stats
                    const stats  = compilation.getStats().toJson();
                    const allAssets = getAssets(stats, chunks);
                    // inject dependent assets
                    assets.js = mergeAssets(assets.js, allAssets.js);
                    assets.css = mergeAssets(assets.css, allAssets.css);
                }
                cb(null, htmlPluginData);
            });
        });
    }
}
module.exports = InjectCommonChunk;
