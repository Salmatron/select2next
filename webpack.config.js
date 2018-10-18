const path = require('path');

module.exports = {
    entry: './src/js/jquery.select2.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'my-select2.js'
    },
    //mode: 'development',
    devtool: 'source-map',
};
