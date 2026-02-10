const atImport = require('postcss-import')

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    atImport(),
  ],
}
