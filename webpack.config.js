const path = require('path');

const
    devOptions = {
        mode: 'development',
        devtool: 'inline-source-map',
    },
    prodOptions = {
        mode: 'production',
    },
    commonOptions = {
        entry: {
            index: './index.js',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
    };

module.exports = env => {

    const config = env.NODE_ENV === 'production' ? prodOptions : devOptions;

    return {...commonOptions, ...config};
};