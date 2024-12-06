const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', // Ensure relative paths for assets
  },
  module: {
    rules: [
      // For JavaScript/JSX files and enable source maps for them
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'], // Ensure React and modern JS are supported
          },
        },
      },
      // For CSS Modules handling
      {
        test: /\.module\.css$/, // Detect `.module.css` files as CSS Modules
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]', // Unique class names
              },
              sourceMap: true, // Enable source maps for CSS
            },
          },
        ],
      },
      // For regular global CSS
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'], // Regular CSS files are not treated as modules
      },
      // For handling images and fonts
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      console: require.resolve('console-browserify'),
    },
  },
  devtool: 'source-map', // Ensure source maps are generated
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // Serve from the output folder
    historyApiFallback: true, // This is useful for React Router
    hot: true, // Enable Hot Module Replacement
  },
};
