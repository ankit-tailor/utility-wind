/** @type {import('tailwindcss').Config} */

const babel = require("@babel/core");
const { uWindTransformer } = require("./babel-plugin/transformer");

module.exports = {
  content: {
    files: ["./**/*.{html,js}", "./*.{tsx, jsx}"],
    transform: uWindTransformer,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
