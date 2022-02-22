module.exports = {
  env: {
    browser: true,
  },
  extends: [
    // tells us all the different rule guidelines it will take on, so it extends from these rules. If we don't put this, then we won't get any error message when any of these rule guidelines are broken.
    "eslint:recommended",
    "airbnb",
    "prettier",
    "plugin:node/recommended",
  ],
  plugins: ["prettier"], // Runs Prettier as an ESLint rule and reports differences as individual ESLint issues.
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // this allows us to disable rules(off) or enforce errors for the rule guidelines we are extending from
    "prettier/prettier": "error", // enforce prettier rules
    quotes: "off", // turns off now allowing me to use double quotes
    "no-console": "off",
    "no-unused-vars": "warn",
    "max-len": "off", // turning off max length when you write coments
    "func-names": "off", // turning off not allowing you to write anonymous functions aka functions without names
    "no-process-exit": "off", // this is a node thing
    "object-shorthand": "off", // turning off not allowing you to write methods like dog: function(){} inside objects
    "class-methods-use-this": "off", // turning off forces you to use this inside classes
    "no-plusplus": "off", // turning off not allowing me to do ++
  },
};
