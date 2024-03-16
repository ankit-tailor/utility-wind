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
const t = require("@babel/types");

const processElementWithoutValue = (
  element,
  className,
  propsToBePersisted,
  classList,
  variantList
) => {
  const elementName = element.name.name;
  if (elementName.startsWith("$")) {
    const property = elementName.slice(1);
    if (classList.includes(property) || variantList.includes(property)) {
      className += property + " ";
    } else {
      propsToBePersisted.push(element);
    }
  } else {
    propsToBePersisted.push(element);
  }
  return className;
};

const processJSXExpressionContainer = (
  element,
  className,
  propsToBePersisted,
  classList,
  variantList,
  aliasesList
) => {
  const elementValue = element.value;
  if (!t.isIdentifier(elementValue.expression)) {
    if (t.isObjectExpression(elementValue.expression)) {
      if (variantList.includes(element.name.name)) {
        const { result } = convertExpressionContainerToStaticObject(
          elementValue.expression.properties
        );
        const variantResolvedValueList = getClassListFromVariantProp(
          result,
          variantList,
          classList,
          [element.name.name]
        );
        className += variantResolvedValueList.join(" ") + " ";
      } else {
        propsToBePersisted.push(element);
      }
    } else {
      const elementValueExpression = elementValue.expression.value;
      className = processElementValueExpression(
        element,
        className,
        propsToBePersisted,
        classList,
        variantList,
        aliasesList,
        elementValueExpression
      );
    }
  } else {
    propsToBePersisted.push(element);
  }
  return className;
};

const processElementValueExpression = (
  element,
  className,
  propsToBePersisted,
  classList,
  variantList,
  aliasesList,
  elementValueExpression
) => {
  if (element.name.name === "className") {
    className += elementValueExpression + " ";
  }
  if (
    classList.includes(`${element.name.name}-${elementValueExpression}`) ||
    variantList.includes(`${element.name.name}-${elementValueExpression}`)
  ) {
    className += `${element.name.name}-${elementValueExpression} `;
  } else if (aliasesList.includes(element.name.name)) {
    className += `${element.name.name}-[${elementValueExpression}] `;
  } else {
    propsToBePersisted.push(element);
  }
  return className;
};

const processStringLiteral = (
  element,
  className,
  propsToBePersisted,
  classList,
  variantList,
  aliasesList
) => {
  const elementValue = element.value.value;
  if (element.name.name === "className") {
    className += elementValue + " ";
  }
  if (
    classList.includes(`${element.name.name}-${elementValue}`) ||
    variantList.includes(`${element.name.name}-${elementValue}`)
  ) {
    className += `${element.name.name}-${elementValue} `;
  } else if (aliasesList.includes(element.name.name)) {
    className += `${element.name.name}-[${elementValue}] `;
  } else {
    propsToBePersisted.push(element);
  }
  return className;
};

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
            let className = "";
            let propsToBePersisted = [];

            attributesList.forEach((element) => {
              if (!element.value) {
                className = processElementWithoutValue(
                  element,
                  className,
                  propsToBePersisted,
                  classList,
                  variantList
                );
              } else if (t.isJSXExpressionContainer(element.value)) {
                className = processJSXExpressionContainer(
                  element,
                  className,
                  propsToBePersisted,
                  classList,
                  variantList,
                  aliasesList
                );
              } else if (t.isStringLiteral(element.value)) {
                className = processStringLiteral(
                  element,
                  className,
                  propsToBePersisted,
                  classList,
                  variantList,
                  aliasesList
                );
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
