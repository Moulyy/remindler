<script setup lang="ts">
import { ref } from "vue"

import LoginForm from "@/components/LoginForm.vue"

type LoginCredentials = {
  email: string
  password: string
}

const isLoading = ref(false)
const errorMessage = ref<string>()

const handleLogin = async (credentials: LoginCredentials) => {
  isLoading.value = true
  errorMessage.value = undefined

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const data = await response.json()

    console.log("Login successful!", data)
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
