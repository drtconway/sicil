const path = require('path');
module.exports = {
  entry: './src/sicil.js',
  output: {
    library: 'sicil',
    libraryTarget: 'umd',
    filename: 'sicil.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
};
