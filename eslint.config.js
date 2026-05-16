import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginPrettier from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/src/**/generated/**",
      "apps/web/src/components/ui/**"
    ]
  },
  {
    languageOptions: {
      globals: {
        console: "readonly",
        document: "readonly"
      }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    files: ["**/*.{js,ts,tsx}"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          printWidth: 100,
          semi: false,
          singleQuote: false,
          trailingComma: "none"
        }
      ],
      "max-len": ["error", { code: 100 }],
      "no-trailing-spaces": "error"
    }
  }
)
