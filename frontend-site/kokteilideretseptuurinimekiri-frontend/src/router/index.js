import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import RecipesView from '../views/RecipesView.vue'
import SingleRecipeView from '../views/SingleRecipeView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    // Only accessible when NOT logged in
    meta: { guestOnly: true } 
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    // Only accessible when NOT logged in
    meta: { guestOnly: true } 
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: RecipesView,
    // Requires authentication
    meta: { requiresAuth: true } 
  },
  {
    path: '/recipes/:recipeID',
    name: 'recipe',
    component: SingleRecipeView,
    // Requires authentication
    meta: { requiresAuth: true }
  },
  {                                          
    path: '/admin',                          
    name: 'admin',                           
    component: AdminView,                   
    meta: { requiresAuth: true, requiresAdmin: true }  
  }   
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Not authenticated, redirect to login
      return next({
        name: 'login',
        query: { redirect: to.fullPath } 
      })
    }
  }
  
  // Check if route requires admin
  if (to.meta.requiresAdmin) {
    if (!authStore.isAdmin) {
      // Not admin, redirect to recipes
      return next({ name: 'recipes' })
    }
  }

  // Check if route is guest only (login/register pages)
  if (to.meta.guestOnly) {
    if (authStore.isAuthenticated) {
      // Already authenticated, redirect to recipes
      return next({ name: 'recipes' })
    }
  }
  
  // Allow navigation
  next()
})

export default router