const myBabel = require("./babel-plugin/index");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [myBabel],
  };
};
