module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  globals: { _: true },
  plugins: ['import', 'html'],
  extends: [
    'airbnb-base',
    'prettier',
    'react-app',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', '@types'],
      },
      typescript: {}, // 프로젝트 Root의 tsconfig.json을 찾는다.
    },
  },
  rules: {
    // "off" or 0 - turn the rule off
    // "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
    // "no-var": "off",
    'no-console': 'off',
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': ['off'],
    'no-shadow': 'off',
    'vars-on-top': 'off',
    'no-underscore-dangle': 'off', // var _foo;
    'comma-dangle': 'off',
    'func-names': 'off', // setTimeout(function () {}, 0);
    'prefer-template': 'off',
    'no-nested-ternary': 'off',
    'max-classes-per-file': 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': ['off', 'ForOfStatement'], // disallow specified syntax(ex. WithStatement)
    'prefer-arrow-callback': 'error', // Require using arrow functions for callbacks
    'require-await': 'error',
    'arrow-parens': ['error', 'as-needed'], // a => {}
    'no-param-reassign': ['error', { props: false }],
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true, // a || b
        allowShortCircuit: true, // a ? b : 0
        allowTaggedTemplates: true,
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ], // prettier의 printWidth 옵션 대신 사용
  },
};
