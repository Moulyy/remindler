import { createRouter, createWebHistory } from "vue-router"

import { useAuthStore } from "@/stores/auth-store"
import Dashboard from "@/views/Dashboard.vue"
import Login from "@/views/Login.vue"

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard"
    },
    {
      path: "/login",
      component: Login,
      meta: {
        guestOnly: true
      }
    },
    {
      path: "/dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth === true) {
    try {
      await authStore.loadAuthenticatedUser()
      return true
    } catch {
      return "/login"
    }
  }

  if (to.meta.guestOnly === true) {
    try {
      await authStore.loadAuthenticatedUser()
      return "/dashboard"
    } catch {
      return true
    }
  }

  return true
})
