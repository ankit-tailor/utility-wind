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
