const { setObjectKeyValue } = require("./utils");

const convertExpressionContainerToStaticObject = (
  properties,
  result = {},
  keyPath = [],
  propsToBePersist = {}
) => {
  properties?.forEach((property, index) => {
    const nodeName = property.key.name ?? property.key.value;
    if (property.value.type === "ObjectExpression") {
      keyPath.push(nodeName);
      convertExpressionContainerToStaticObject(
        property.value.properties,
        result,
        keyPath,
        propsToBePersist
      );
      keyPath.pop();
    } else if (property.value.type === "Identifier") {
      if (property.key.value) {
        setObjectKeyValue(
          propsToBePersist,
          [...keyPath, nodeName],
          property.value.name
        );
      }
      if (property.key.name) {
        setObjectKeyValue(
          propsToBePersist,
          [...keyPath, nodeName],
          property.value.name
        );
      }
    } else {
      if (property.key.value) {
        setObjectKeyValue(
          result,
          [...keyPath, property.key.value],
          property.value.value
        );
      }

      if (property.key.name) {
        setObjectKeyValue(
          result,
          [...keyPath, property.key.name],
          property.value.value
        );
      }
    }
  });
  return {
    result,
    propsToBePersist,
  };
};

module.exports = {
  convertExpressionContainerToStaticObject,
};
