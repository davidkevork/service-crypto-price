const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    devtool: false,
    entry: slsw.lib.entries,
    mode: 'production',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                include: [path.resolve(__dirname, 'src')],
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: false,
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
    },
    // Fix: Replace below when lambda aws-sdk runtime is updated to support ApiGatewayManagementApi
    // externals: [{'aws-sdk': 'commonjs aws-sdk'}, nodeExternals()],
    externals: {
        sharp: 'commonjs sharp',
    },
    performance: {
        // Turn off size warnings for entry points
        hints: false,
    },
    plugins: [],
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    target: 'node',
};
