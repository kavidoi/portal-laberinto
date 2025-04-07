const path = require('path');

module.exports = {
  // Entry point for the bundle
  entry: './src/index.js',
  
  // Output of the bundle
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  
  // Module rules for processing different file types
  module: {
    rules: [
      {
        // Process JavaScript files with Babel
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
          // Babel config can be specified here or in a separate .babelrc file
        }
      },
      {
        // Process CSS files
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  // Development server configuration
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
    open: true
  },
  
  // Set mode to development or production via CLI arguments
  mode: 'development'
};
