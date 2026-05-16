<script setup lang="ts">
import type { LoginUserRequest } from "@remindler/shared"
import { ref } from "vue"
import { useRouter } from "vue-router"

import LoginForm from "@/components/LoginForm.vue"
import { useAuthStore } from "@/stores/auth-store"

const isLoading = ref(false)
const errorMessage = ref<string>()
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async (credentials: LoginUserRequest) => {
  isLoading.value = true
  errorMessage.value = undefined

  try {
    await authStore.loginUser(credentials)
    await router.push("/dashboard")
  } catch {
    errorMessage.value = "Identifiants invalides."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <LoginForm
        :error-message="errorMessage"
        :is-loading="isLoading"
        @login="handleLogin"
      />
    </div>
  </div>
</template>
