const path = require('path');

module.exports = {
    entry: './src/js/jquery.select2.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'select2next.js',
        libraryTarget: 'umd',
        library: 'Select2',
    },
    mode: 'production',
    devtool: 'source-map',
};
