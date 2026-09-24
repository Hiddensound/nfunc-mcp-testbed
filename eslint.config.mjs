import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "public/js/vendor/**", "scripts/**"],
  },
  js.configs.recommended,
  {
    files: ["server.js", "src/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.browser,
    },
  },
];
