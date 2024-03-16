const { getClassList, getVariantList, getConfig } = require("./load-config");
const fs = require("fs");
const path = require("path");

function getPropertyValue(classname, aliasesMap, value = undefined) {
  const isAlias = aliasesMap.get(classname);
  const splittedClassName = classname.split("-");

  if (!isAlias && splittedClassName.length > 1) {
    const nextAliasCandidate = splittedClassName
      .slice(0, splittedClassName.length - 1)
      .join("-");
    const nextValueCandidate = [
      splittedClassName[splittedClassName.length - 1],
      value,
    ]
      .filter(Boolean)
      .join("-");
    if (nextAliasCandidate) {
      return getPropertyValue(
        nextAliasCandidate,
        aliasesMap,
        nextValueCandidate
      );
    }
  }
  return {
    classname,
    value,
  };
}

function generateTypes() {
  const { context: tailwindUserContext } = getConfig();
  const classList = getClassList(tailwindUserContext);
  const variantList = getVariantList(tailwindUserContext);

  const classListMap = new Map();

  classList.map((classname) => {
    const { classname: aliasedClassNameWithNegativeSymbol, value } =
      getPropertyValue(classname, tailwindUserContext?.candidateRuleMap);

    if (value) {
      let aliasedClassName = aliasedClassNameWithNegativeSymbol;

      if (aliasedClassNameWithNegativeSymbol.startsWith("-")) {
        aliasedClassName = aliasedClassNameWithNegativeSymbol.slice(1);
      }
      const currentClassValue = classListMap.get(aliasedClassName) || [];
      const nextClassValue = [...currentClassValue, value];
      if (aliasedClassNameWithNegativeSymbol.startsWith("-")) {
        nextClassValue.push(`-${value}`);
      }
      classListMap.set(aliasedClassName, nextClassValue);
    } else {
      classListMap.set(classname, []);
    }
  });

  let template = `
    import * as React from "react";
  
    type IUtilityWindBase = {\n`;

  classListMap.forEach((values, key) => {
    const valuesWithQoutes =
      values.length > 0 ? values.map((value) => `'${value}'`) : undefined;

    if (!valuesWithQoutes) {
      template += `  '$${key}'?: true,\n`;
    } else {
      let valueType = valuesWithQoutes.join(" | ");
      template += `  '${key}'?: ${valueType} | (string & {}),\n`;
    }
  });

  template += `}\n`;

  template += `type IUtilityWindVariants = {\n`;

  variantList.map((variant) => {
    template += `  '${variant}'?: IUtilityWindBase,\n`;
  });

  template += `}

  type IUtilityWind = IUtilityWindBase & IUtilityWindVariants;
    
  declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        div: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDivElement> &
            Omit<IUtilityWind, keyof HTMLDivElement>,
          HTMLDivElement
        >;
      }
    }
  }
    `;

  fs.writeFileSync(
    path.join(process.cwd(), "./tailwind-classlist-map.ts"),
    template,
    {
      encoding: "utf-8",
    }
  );
}

module.exports = {
  generateTypes,
};
