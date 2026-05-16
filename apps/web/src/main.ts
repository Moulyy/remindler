import { createApp } from "vue"

import App from "./App.vue"
import { router } from "./router"
import { setUnauthorizedHandler } from "./services/api-client"
import { useAuthStore } from "./stores/auth-store"
import "./style.css"

setUnauthorizedHandler(async () => {
  const authStore = useAuthStore()

  authStore.clearAuthenticatedUser()

  if (router.currentRoute.value.path !== "/login") {
    await router.push("/login")
  }
})

createApp(App).use(router).mount("#app")
