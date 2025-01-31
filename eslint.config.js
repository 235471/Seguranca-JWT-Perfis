const globals = require('globals');
const pluginJs = require('@eslint/js');
const prettierPlugin = require('eslint-plugin-prettier');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
        require: 'readonly', // Adicionando require como global
        module: 'readonly', // Adicionando module como global
      },
      parserOptions: {
        ecmaVersion: 2020, // Defina a versão do ECMAScript (ajuste conforme necessário)
      },
    },
  },
  pluginJs.configs.recommended, // Recomendação de configuração do plugin JS
  {
    plugins: {
      prettier: prettierPlugin, // Definindo o plugin corretamente
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
      // Regras de formatação específicas do Prettier
      'prettier/prettier': [
        'error',
        {
          printWidth: 130, // Comprimento máximo da linha
          semi: true, // Exigir ponto e vírgula
          singleQuote: true, // Usar aspas simples
          proseWrap: 'never', // Prevenir quebras de linha em conteúdo textual
        },
      ],
      // Desabilitar a regra 'function-paren-newline' do ESLint em favor do Prettier
      'function-paren-newline': 'off',
      // Regras adicionais do ESLint
      semi: ['error', 'always'], // Exigir ponto e vírgula
      quotes: ['error', 'single'], // Usar aspas simples
    },
  },
];
