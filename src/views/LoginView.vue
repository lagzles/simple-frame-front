<template>
  <AuthLayout>
    <form class="auth-form" @submit.prevent="submit">
      <AppAlert v-if="auth.error" variant="danger" :message="auth.error" />
      <AppFormField label="Email">
        <AppInput v-model="email" type="email" autocomplete="email" />
      </AppFormField>
      <AppFormField label="Senha">
        <AppInput v-model="password" type="password" autocomplete="current-password" />
      </AppFormField>
      <AppButton type="submit" :loading="auth.loading">Entrar</AppButton>
      <RouterLink to="/register">Criar conta</RouterLink>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../components/layout/AuthLayout.vue'
import AppAlert from '../components/ui/AppAlert.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppFormField from '../components/ui/AppFormField.vue'
import AppInput from '../components/ui/AppInput.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

async function submit() {
  await auth.login(email.value, password.value)
  await router.push('/buildings')
}
</script>
