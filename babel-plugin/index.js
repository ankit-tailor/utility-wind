const { getAliasesList, getClassList, getConfig } = require("./load-config");

module.exports = function (babel) {
  const { types: t } = babel;

  const { context: tailwindUseContext, config: tailwindConfig } = getConfig();
  const aliasesList = getAliasesList(tailwindUseContext);
  const classList = getClassList(tailwindUseContext);

  return {
    visitor: {
      JSXOpeningElement(jsxOpeningPath, state) {
        const filename = state.file.opts.filename;

        if (!filename.includes("node_modules") && !filename.includes(".expo")) {
          const propsToBePersisted = [];
          const attributesList = jsxOpeningPath.node.attributes;
          let className = "";
          if (attributesList) {
            attributesList.forEach((element) => {
              if (!t.isIdentifier(element.value)) {
                const elementName = element.name.name;
                let elementValue = element.value;

                if (aliasesList.includes(elementName)) {
                  if (t.isJSXExpressionContainer(element.value)) {
                    elementValue = elementValue.expression.value;
                  } else {
                    elementValue = elementValue.value;
                  }

                  console.log("elementValue", elementValue, elementName);

                  if (elementName === "className") {
                    className = elementValue;
                  }

                  if (classList.includes(`${elementName}-${elementValue}`)) {
                    className += `${elementName}-${elementValue} `;
                  } else {
                    className += `${elementName}-[${elementValue}] `;
                  }
                } else {
                  propsToBePersisted.push(element);
                }
              }
            });

            jsxOpeningPath.node.attributes = [
              ...propsToBePersisted,
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
