const uWindBabelPlugin = require("./index");
const babel = require("@babel/core");

function transform(code, extenstion) {
  try {
    const config = {
      filename: `uWindTransformer.${extenstion}`,
      plugins: [uWindBabelPlugin],
      presets: [],
    };

    if (extenstion === "tsx" || extenstion === "ts") {
      config.presets.push("@babel/preset-typescript");
    }

    const res = babel.transformSync(code, config);

    if (!res?.code) {
      throw new Error("Failed to transform the code");
    }

    return res.code;
  } catch (error) {
    console.error(code, error);
    return code;
  }
}

export const uWindTransformer = {
  tsx: (content) => transform(content, "tsx"),
  jsx: (content) => transform(content, "jsx"),
  //   js: (content) => transform(content, "js"),
};
