module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    rules: {
        "no-unused-vars": "off",
        "no-empty": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        // "@typescript-eslint/indent": ["error", 4],
        "max-len": [
            "error",
            {
                code: 150,
                ignoreComments: true,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreString: true,
            },
        ],
    },
};
