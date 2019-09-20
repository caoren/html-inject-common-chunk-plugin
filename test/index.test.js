const path = require('path');
const fs = require('fs');
const InjectCommonChunk = require('../index');

describe('apply v4', () => {
    const compiler = {
        hooks: {
            compilation: {
                tap: jest.fn(),
            },
        }
    };
    test('compiler hook compilation', () => {
        const plugin = new InjectCommonChunk();
        plugin.apply(compiler);
        expect(compiler.hooks.compilation.tap).toHaveBeenCalledWith('InjectCommonChunkPlugin', expect.any(Function));
    });
    describe('compilation hook', () => {
        let compilation = {
            hooks: {
                htmlWebpackPluginBeforeHtmlGeneration: {
                    tapAsync: jest.fn(),
                }
            },
        };
        beforeEach(() => {
            compilation = {
                hooks: {
                    htmlWebpackPluginBeforeHtmlGeneration: {
                        tapAsync: jest.fn(),
                    }
                }
            };
            compiler.hooks.compilation.tap.mockImplementation((hookName, callback) => callback(compilation));
        });

        test('attaches async hook to htmlWebpackPluginBeforeHtmlGeneration', () => {
            const plugin = new InjectCommonChunk();
            plugin.apply(compiler);
            expect(compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync).toHaveBeenCalledWith(
                'InjectCommonChunkPlugin',
                expect.any(Function)
            );
        });

        describe('htmlWebpackPluginBeforeHtmlGeneration hook', () => {
            let htmlPluginData;
            let hookCallback = jest.fn();

            beforeEach(() => {
                htmlPluginData = {
                    assets: {
                        js: ['/s/a.js'],
                        css: []
                    },
                    plugin: {
                        options: {
                            chunks: ['index', 'list']
                        }
                    }
                };
                compilation.getStats = () => {
                    return {
                        toJson: () => {
                            return {
                                namedChunkGroups: {
                                    'index': {
                                        assets: [
                                            'a.js',
                                            'a.css',
                                            'b.js'
                                        ]
                                    }
                                },
                                publicPath: '/s/'
                            }
                        }
                    }
                }
                compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync.mockImplementation((mockName, callback) =>
                    callback(htmlPluginData, hookCallback)
                );
            });

            test('htmlPluginData', () => {
                const plugin = new InjectCommonChunk();
                plugin.apply(compiler);
                expect(hookCallback).toHaveBeenCalledWith(null, htmlPluginData);
                expect(htmlPluginData.assets).toEqual({
                    js: [ '/s/a.js', '/s/b.js' ],
                    css: [ '/s/a.css' ]
                });
            });
        });

        describe('htmlWebpackPluginBeforeHtmlGeneration stats not has namedChunkGroups', () => {
            let htmlPluginData;
            let hookCallback = jest.fn();

            beforeEach(() => {
                htmlPluginData = {
                    assets: {
                        js: [],
                        css: []
                    },
                    plugin: {
                        options: {
                            chunks: ['index']
                        }
                    }
                };
                compilation.getStats = () => {
                    return {
                        toJson: () => {
                            return {
                                publicPath: '/s/'
                            }
                        }
                    }
                }
                compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync.mockImplementation((mockName, callback) =>
                    callback(htmlPluginData, hookCallback)
                );
            });

            test('htmlPluginData', () => {
                const plugin = new InjectCommonChunk();
                plugin.apply(compiler);
                expect(hookCallback).toHaveBeenCalledWith(null, htmlPluginData);
                expect(htmlPluginData.assets).toEqual({
                    js: [],
                    css: []
                });
            });
        });

        describe('htmlWebpackPluginBeforeHtmlGeneration chunk not a array', () => {
            let htmlPluginData;
            let hookCallback = jest.fn();

            beforeEach(() => {
                htmlPluginData = {
                    assets: {
                        js: [],
                        css: []
                    },
                    plugin: {
                        options: {
                            chunks: 'index'
                        }
                    }
                };
                compilation.getStats = () => {
                    return {
                        toJson: () => {
                            return {
                                namedChunkGroups: {
                                    'index': {
                                        assets: [
                                            'a.js',
                                            'a.css',
                                            'b.js'
                                        ]
                                    }
                                },
                                publicPath: '/s/'
                            }
                        }
                    }
                }
                compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync.mockImplementation((mockName, callback) =>
                    callback(htmlPluginData, hookCallback)
                );
            });

            test('htmlPluginData', () => {
                const plugin = new InjectCommonChunk();
                plugin.apply(compiler);
                expect(hookCallback).toHaveBeenCalledWith(null, htmlPluginData);
                expect(htmlPluginData.assets).toEqual({
                    js: [],
                    css: []
                });
            });
        });

        describe('htmlWebpackPluginBeforeHtmlGeneration no uniq', () => {
            let htmlPluginData;
            let hookCallback = jest.fn();

            beforeEach(() => {
                htmlPluginData = {
                    assets: {
                        js: ['/s/c.js'],
                        css: []
                    },
                    plugin: {
                        options: {
                            chunks: ['index']
                        }
                    }
                };
                compilation.getStats = () => {
                    return {
                        toJson: () => {
                            return {
                                namedChunkGroups: {
                                    'index': {
                                        assets: [
                                            'a.js',
                                            'a.css',
                                            'b.js'
                                        ]
                                    }
                                },
                                publicPath: '/s/'
                            }
                        }
                    }
                }
                compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync.mockImplementation((mockName, callback) =>
                    callback(htmlPluginData, hookCallback)
                );
            });

            test('htmlPluginData', () => {
                const plugin = new InjectCommonChunk();
                plugin.apply(compiler);
                expect(hookCallback).toHaveBeenCalledWith(null, htmlPluginData);
                expect(htmlPluginData.assets).toEqual({
                    js: [ '/s/c.js', '/s/a.js', '/s/b.js' ],
                    css: [ '/s/a.css' ]
                });
            });
        });

    });
});