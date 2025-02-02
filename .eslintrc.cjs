module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  rules: {
    "no-console": "off",
    "no-unused-vars": "warn",
    "semi": ["warn", "always"],
    "indent": ["warn", 2]
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module"
  }
};