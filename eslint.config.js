import js from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"]
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
  {
    files: ["**/*.{js,ts,tsx}"],
    rules: {
      "quotes": ["error", "double"],
      "semi": ["error", "never"],
      "max-len": ["error", { "code": 100 }],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"]
    }
  }
)
