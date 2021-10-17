module.exports = {
    parser: "vue-eslint-parser",
    extends: [
        "eslint:recommended",
        "plugin:prettier/recommended",
        "plugin:vue/recommended",
        "plugin:prettier/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es2021: true,
    },
    rules: {
        // 分号
        "semi": "error",
        // 对象键值引号样式保持一致
        "quote-props": ["error", "consistent-as-needed"],
        // 箭头函数允许单参数不带括号
        "arrow-parens": ["error", "as-needed"],
        // no var
        "no-var": "error",
        // const
        "prefer-const": "error",
        // 允许console
        "no-console": "off",
    },
};
