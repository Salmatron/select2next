const path = require('path');

module.exports = {
    entry: {
        integration: './tests/integration.js',
        unit: './tests/unit.js',
    },
    output: {
        path: path.resolve(__dirname, 'tests'),
        filename: '[name].bundle.js'
    },
    // resolve: {
    //     modules: [path.resolve(__dirname, 'src/js'), 'node_modules'],
    // },
    mode: 'production',
    devtool: 'source-map',
};

