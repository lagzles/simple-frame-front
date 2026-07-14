<template>
  <main class="app-layout">
    <aside class="sidebar">
      <strong>Simple Frame</strong>
      <nav>
        <RouterLink to="/buildings">Prédios</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span>{{ auth.user?.email }}</span>
        <AppButton variant="ghost" @click="logout">Sair</AppButton>
      </div>
    </aside>
    <section class="content">
      <slot />
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import AppButton from '../ui/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  await router.push('/login')
}
</script>
