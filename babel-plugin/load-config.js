const path = require("path");
const fs = require("fs");

const resolveConfig = require("tailwindcss/resolveConfig.js");
const { createContext } = require("tailwindcss/lib/lib/setupContextUtils.js");

function getConfigPath() {
  try {
    if (fs.existsSync(path.join(process.cwd(), "./tailwind.config.js"))) {
      return path.join(process.cwd(), "./tailwind.config.js");
    }
    throw new Error(
      "Tailwind config file not found. Please create a tailwind.config.js file in the root of your project."
    );
  } catch (err) {
    throw new Error(err, "Error in getConfigPath");
  }
}

function getConfig() {
  try {
    const configFile = getConfigPath();
    const userConfig = resolveConfig(configFile);

    const ctx = createContext(userConfig);

    return {
      context: ctx,
      config: userConfig,
    };
  } catch (err) {
    throw new Error(err, "Error in getConfig");
  }
}

function getAliasesList(tailwindUserContext) {
  const aliasesList = [...tailwindUserContext?.candidateRuleMap.keys()];
  return aliasesList;
}

function getClassList(tailwindUserContext) {
  const classList = tailwindUserContext.getClassList();

  return classList;
}

function getVariantList(tailwindUserContext) {
  const variantList = [...tailwindUserContext?.variantMap.keys()];
  return variantList;
}

module.exports = {
  getConfig,
  getAliasesList,
  getClassList,
  getVariantList,
};
