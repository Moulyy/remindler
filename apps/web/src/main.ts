import { getMessage } from "@remindler/shared"

const app = document.querySelector<HTMLDivElement>("#app")

if (app) {
  app.textContent = getMessage()
}
