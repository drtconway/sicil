const path = require('path');

module.exports = {
  entry: './src/sicil.js',
  output: {
    filename: 'sicil.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
