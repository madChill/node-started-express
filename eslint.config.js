const eslint = require('@eslint/js');
const sortRequires = require('eslint-plugin-sort-requires');
const airbnbBase = require('eslint-config-airbnb-base');
const globals = require('globals');
const babelParser = require('@babel/eslint-parser');

module.exports = [
    eslint.configs.recommended,
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/.git/**',
            '**/public/**',
            '**/*.min.js',
            '**/vendor/**',
            '**/.nyc_output/**',
            '**/.vscode/**',
            '**/migrations/**',
        ],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            parser: babelParser,
            globals: {
                ...airbnbBase.globals,
                ...globals.node
            },

        },
        
        plugins: {
            'sort-requires': sortRequires,
        },
        rules: {
            'no-console': 'off',
            'no-underscore-dangle': 'off',
            'no-unused-vars': ['error', {
                varsIgnorePattern: '(Promise|_.+)',
                argsIgnorePattern: 'scope|next|Promise|_.+'
            }],
            'no-use-before-define': ['error', { 'variables': false }],
            'no-multi-str': 'off',
            'space-before-function-paren': 'off',
            'arrow-body-style': 'off',
            'no-debugger': 'error',

            // Include any other rules from airbnb-base you want to keep
            ...airbnbBase.rules,
        },
    },
];