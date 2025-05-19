module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 100,
  bracketSpacing: true,
  overrides: [
    {
      files: "*.html",
      options: { parser: "html" },
    },
    {
      files: "*.component.html",
      options: { parser: "angular" },
    },
  ],
};
