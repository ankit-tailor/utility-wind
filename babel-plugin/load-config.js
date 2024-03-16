const resolveConfig = require("tailwindcss/resolveConfig.js");
const path = require("path");
const { createContext } = require("tailwindcss/lib/lib/setupContextUtils.js");
const fs = require("fs");

function getConfigPath() {
  if (fs.existsSync(path.join(process.cwd(), "./tailwind.config.js"))) {
    return path.join(process.cwd(), "./tailwind.config.js");
  }

  throw new Error("Tailwind config file not found");
}

function getConfig() {
  const configFile = getConfigPath();
  const userConfig = resolveConfig(configFile);

  const ctx = createContext(userConfig);
  // const classList = ctx.getClassList();

  return {
    context: ctx,
    config: userConfig,
  };
}

function getAliasesList(tailwindUseContext) {
  const aliasesList = Array.from(tailwindUseContext?.candidateRuleMap?.keys());
  return aliasesList;
}

function getClassList(tailwindUseContext) {
  const classList = tailwindUseContext.getClassList();
  return classList;
}

module.exports = {
  getConfig,
  getAliasesList,
  getClassList,
};
