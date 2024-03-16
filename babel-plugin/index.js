const resolveConfig = require("tailwindcss/resolveConfig.js");
const path = require("path");
function getConfigPath() {
  return path.join(process.cwd(), "./tailwind.config.js");
  const config = {
    configPath: "./tailwind.config.js",
  };

  for (const configFile of [
    config.configPath,
    "./tailwind.config.js",
    "./tailwind.config.cjs",
  ]) {
    try {
      const configPath = path.join(process.cwd(), configFile);
      fs.accessSync(configPath);
      return configPath;
    } catch (err) {}
  }
}

function getConfig() {
  const configFile = getConfigPath();
  const userConfig = resolveConfig(configFile);
  console.log("configFile", userConfig);

  // console.log("userConfig", userConfig);
}

getConfig();

module.exports = function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      JSXOpeningElement(jsxOpeningPath, state) {
        const filename = state.file.opts.filename;

        if (!filename.includes("node_modules") && !filename.includes(".expo")) {
          const attributesList = jsxOpeningPath.node.attributes;
          let className = "";
          if (attributesList) {
            attributesList.forEach((element) => {
              if (!t.isIdentifier(element.value)) {
                const elementName = element.name.name;
                let elementValue = element.value;

                if (t.isJSXExpressionContainer(element.value)) {
                  elementValue = elementValue.expression.value;
                } else {
                  elementValue = elementValue.value;
                }

                console.log("elementValue", elementValue, elementName);

                if (elementName === "className") {
                  className = elementValue;
                }

                className += `${elementName}-${elementValue} `;
              }
            });

            console.log("className", className);

            jsxOpeningPath.node.attributes = [
              t.jsxAttribute(
                t.jsxIdentifier("className"),
                t.stringLiteral(className)
              ),
            ];
          }
        }
      },
    },
  };
};
