module.exports = {
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "parser": "babel-eslint",
  "env": {
    "jest": true,
    "browser": true,
    "node": true
  },
  "rules": {
    "semi": ["error", "never"],
    "react/forbid-prop-types": "off",
    "no-confusing-arrow": ["off"],
    "padded-blocks": ["error", { "classes": "always" }],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "return" }
    ],
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "arrow-body-style": "off",
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "class-methods-use-this": "off",
    "react/prefer-stateless-function": "off",
    "object-curly-newline": "off",
    "react/jsx-filename-extension": "off",
    "import/first": "off",
    "react/jsx-one-expression-per-line": "off",
    "import/no-useless-path-segments": "off",
    "import/order": "off",
    "react/react-in-jsx-scope": "off",
    "implicit-arrow-linebreak": "off",
    "import/prefer-default-export": "off",
    "no-return-assign": "off"
  }
}
