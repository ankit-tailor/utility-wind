const {
  getAliasesList,
  getClassList,
  getConfig,
  getVariantList,
} = require("./load-config");
const {
  convertExpressionContainerToStaticObject,
} = require("./expression-to-static-object");
const {
  getClassListFromVariantProp,
} = require("./get-variant-classlist-props");

module.exports = function (babel) {
  const { types: t } = babel;

  const { context: tailwindUserContext, config: tailwindConfig } = getConfig();
  const aliasesList = getAliasesList(tailwindUserContext);
  const classList = getClassList(tailwindUserContext);
  const variantList = getVariantList(tailwindUserContext);

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
              const elementName = element.name.name;
              let elementValue = element.value;
              if (!elementValue) {
                if (elementName.startsWith("$")) {
                  if (!elementValue) {
                    const property = elementName.slice(1);

                    if (
                      classList.includes(property) ||
                      variantList.includes(property)
                    ) {
                      className += property + " ";
                    }
                  } else {
                    propsToBePersisted.push(element);
                  }
                } else {
                  propsToBePersisted.push(element);
                }
              } else if (t.isJSXExpressionContainer(element.value)) {
                if (!t.isIdentifier(elementValue.expression)) {
                  if (t.isObjectExpression(elementValue.expression)) {
                    if (variantList.includes(elementName)) {
                      const { result } =
                        convertExpressionContainerToStaticObject(
                          elementValue.expression.properties
                        );

                      const variantResolvedValueList =
                        getClassListFromVariantProp(
                          result,
                          variantList,
                          classList,
                          [elementName]
                        );
                      className += variantResolvedValueList.join(" ") + " ";
                    } else {
                      propsToBePersisted.push(element);
                    }
                  } else {
                    elementValue = elementValue.expression.value;

                    if (elementName === "className") {
                      className += elementValue + " ";
                    }

                    if (
                      classList.includes(`${elementName}-${elementValue}`) ||
                      variantList.includes(`${elementName}-${elementValue}`)
                    ) {
                      className += `${elementName}-${elementValue} `;
                    } else if (aliasesList.includes(elementName)) {
                      className += `${elementName}-[${elementValue}] `;
                    } else {
                      propsToBePersisted.push(element);
                    }
                  }
                } else {
                  propsToBePersisted.push(element);
                }
              } else if (t.isStringLiteral(elementValue)) {
                elementValue = elementValue.value;
                if (elementName === "className") {
                  className += elementValue + " ";
                }

                if (
                  classList.includes(`${elementName}-${elementValue}`) ||
                  variantList.includes(`${elementName}-${elementValue}`)
                ) {
                  className += `${elementName}-${elementValue} `;
                } else if (aliasesList.includes(elementName)) {
                  className += `${elementName}-[${elementValue}] `;
                } else {
                  propsToBePersisted.push(element);
                }
              } else {
                propsToBePersisted.push(element);
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
