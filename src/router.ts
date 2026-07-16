import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/buildings' },
    { path: '/login', name: 'login', component: () => import('./views/LoginView.vue'), meta: { public: true } },
    { path: '/register', name: 'register', component: () => import('./views/RegisterView.vue'), meta: { public: true } },
    { path: '/buildings', name: 'buildings', component: () => import('./views/BuildingsView.vue') },
    { path: '/buildings/:buildingId/model', redirect: (to) => `/buildings/${to.params.buildingId}/modulations` },
    { path: '/buildings/:buildingId/modulations', name: 'building-modulations', component: () => import('./views/BuildingFramesView.vue') },
    { path: '/buildings/:buildingId/modulations/:modulationId', name: 'modulation-model', component: () => import('./views/BuildingModelView.vue') },
    { path: '/frames/:frameId/loads', name: 'frame-loads', component: () => import('./views/FrameLoadsView.vue') },
    { path: '/frames/:frameId/analysis', name: 'frame-analysis', component: () => import('./views/FrameAnalysisView.vue') },
    { path: '/analysis-jobs/:jobId/results', name: 'analysis-results', component: () => import('./views/AnalysisResultsView.vue') },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.checked) {
    await auth.loadMe()
  }

  if (!to.meta.public && !auth.user) {
    return { name: 'login' }
  }

  if (to.meta.public && auth.user) {
    return { name: 'buildings' }
  }

  return true
})
