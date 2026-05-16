import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    passWithNoTests: true,
    setupFiles: ["./apps/api/src/__tests__/setup-env.ts"]
  }
})
