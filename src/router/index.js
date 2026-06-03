import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import WorkDetailPage from '../pages/WorkDetailPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/work/:slug', name: 'work', component: WorkDetailPage, props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 0 }
    return { top: 0 }
  }
})

export default router
