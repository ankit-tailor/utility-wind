const setObjectKeyValue = (obj, keys, value) => {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  let current = obj;
  keys?.forEach((key, index) => {
    if (index === keys?.length - 1) {
      if (Array.isArray(current[key]) && Array.isArray(value)) {
        // Merge the arrays
        current[key] = [...current[key], ...value];
      } else if (
        current[key] &&
        typeof current[key] === "object" &&
        typeof value === "object"
      ) {
        // Merge objects
        current[key] = { ...current[key], ...value };
      } else {
        // Simply set the value if not merging with an array or object
        current[key] = value;
      }
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  });
  return obj;
};

module.exports = {
  setObjectKeyValue,
};
