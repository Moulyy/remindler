import { createRouter, createWebHistory } from "vue-router"

import { getAuthenticatedUser } from "@/services/auth-api"
import { getAuthToken } from "@/services/auth-session"
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
  if (to.meta.requiresAuth === true) {
    if (getAuthToken() === undefined) {
      return "/login"
    }

    try {
      await getAuthenticatedUser()
      return true
    } catch {
      return "/login"
    }
  }

  if (to.meta.guestOnly === true && getAuthToken() !== undefined) {
    try {
      await getAuthenticatedUser()
      return "/dashboard"
    } catch {
      return true
    }
  }

  return true
})
