module.exports = {
  env: {
    'browser': true,
    'es2021': true,
    'node': true,
    'jest/globals': true,
    'jasmine': true,
  },
  plugins: ['jest'],
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-return-await': 'off',
    'import/prefer-default-export': 'off', // No default export needed
    'import/extensions': 'off', // Turns off check to make sure that the .js is not in file name AWS needs it
    'strict': 'off', // Do not remove this it will break code. Specifically lib/xml2js
    'no-case-declarations': 'off', // Team does not like the syntax
    'vars-on-top': 'off', // Too much refactoring Team does not like the syntax
    'quote-props': 'on', // Prettier in charge of applying quotes
    'no-prototype-builtins': 'off', // Hold off until we move to TS / ES6
    'consistent-return': 'off', // Requires consistent returns across function -possible later
    'no-tabs': 'off', // No tabs located in the comments is not important for code clarity
    'no-shadow': 'off', // High amount of refactoring and do not like syntax changes
    'implicit-arrow-linebreak': 'off', // Causing issues especially with the error logging on try/catch-prettier reverts
    'operator-linebreak': 'off', // Cant do this due to the concatenation of values at the end of a line
    'no-bitwise': 'off', // Cant do this because of the checks on the serviceLevels
    'camelcase': 'off', // Cant do this due to the broad use of non-camel case such as http_request
    'no-underscore-dangle': 'off', // Syntax is unnecessary as we are not setting these values as private/public
    'global-require': 'off', // There are many requires that are in the middle of function calls
    'comma-dangle': 'off', // Syntax is unnecessary
    'prefer-destructuring': 'off', // Cause a lot of refactoring that is not necessary and could cause bugs-possible later
    'max-len': 'off', // Conflicting with prettier
    'no-use-before-define': 'off', // There are many calls that have functions that come after the actual execution of the sub-call
    'no-plusplus': 'off', // Syntax is bad due to for loops using i++
    'eqeqeq': 'off', // Prefer to be able to use == this will most certainly cause issues
    'import/order': 'off', // Setting order of import/require is going to be too much maintenance and will require a lot of constant work
    'no-param-reassign': 'off',
    'no-console': 'off', // Console log are used throughout the specs and not sure at this point how to get wallaby to properly show logger.verbose
    'no-await-in-loop': 'off', // There are a considerable number of loops with await in the loop
    'object-curly-newline': 'off', // Prefer the way prettier does it
    'no-unused-vars': 'error',
    'import/no-relative-packages': 'off',
    'no-throw-literal': 'off', // turned off ability to perfor throw instead of throw new error
    'no-continue': 'off',
    'quotes': ['warning', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }]
  },
};
