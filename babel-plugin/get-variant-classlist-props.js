function getClassListFromVariantProp(
  propsObject,
  variantList,
  classList,
  keyPath = [],
  tailwindClassConvertedList = []
) {
  const propsObjectKeys = Object.keys(propsObject);
  propsObjectKeys.forEach((key) => {
    if (variantList.includes(key)) {
      if (typeof propsObjectKeys[key] === "object") {
        keyPath.push(key);
        getClassListFromVariantProp(
          propsObject[key],
          variantList,
          classList,
          keyPath,
          tailwindClassConvertedList
        );
        keyPath.pop();
      } else {
        const keyString = keyPath.join(":") + `:${key}-${propsObject[key]}`;
        tailwindClassConvertedList.push(keyString);
      }
    } else if (classList.includes(`${key}-${propsObject[key]}`)) {
      const keyString = keyPath.join(":") + `:${key}-${propsObject[key]}`;
      tailwindClassConvertedList.push(keyString);
    } else {
      const keyString = keyPath.join(":") + `:${key}-[${propsObject[key]}]`;
      tailwindClassConvertedList.push(keyString);
    }
  });

  return tailwindClassConvertedList;
}
module.exports = {
  getClassListFromVariantProp,
};
