<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ref } from "vue"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  isLoading?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  login: [credentials: { email: string; password: string }]
}>()

const email = ref("")
const password = ref("")

const submitLogin = () => {
  emit("login", {
    email: email.value,
    password: password.value
  })
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connecte-toi pour acceder a ton foyer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitLogin">
          <FieldGroup>
            <Field>
              <FieldLabel for="email">Email</FieldLabel>
              <Input
                id="email"
                v-model="email"
                autocomplete="email"
                placeholder="antoine@dupont.com"
                required
                type="email"
              />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel for="password">
                  Password
                </FieldLabel>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" v-model="password" required />
            </Field>
            <Field>
              <Button class="w-full" :disabled="props.isLoading" type="submit">
                {{ props.isLoading ? "Connexion..." : "Se connecter" }}
              </Button>
              <FieldDescription v-if="props.errorMessage" class="text-center text-destructive">
                {{ props.errorMessage }}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
