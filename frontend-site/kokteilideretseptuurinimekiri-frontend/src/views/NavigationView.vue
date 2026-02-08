<template>
  <nav class="navbar">
    <div class="nav-container">

      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
        
        <!-- Shows Recipes only when authenticated -->
        <li v-if="isAuthenticated" class="nav-item">
          <router-link to="/recipes" class="nav-link">Recipes</router-link>
        </li>
        
        <!-- Shows Login/Register only when NOT authenticated -->
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/login" class="nav-link">Login</router-link>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/register" class="nav-link">Register</router-link>
        </li>
        
        <!-- Shows user info and logout when authenticated -->
        <li v-if="isAuthenticated" class="nav-item user-info">
          <span class="username">
            {{ currentUser?.UserName }}
            <span v-if="isAdmin" class="admin-badge">Admin</span>
          </span>
        </li>
        <li v-if="isAuthenticated" class="nav-item">
          <button @click="handleLogout" class="nav-link logout-btn">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/store/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navigation',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)
    const currentUser = computed(() => authStore.currentUser)
    
    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }
    
    return {
      isAuthenticated,
      isAdmin,
      currentUser,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-logo:hover {
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
}

.nav-item {
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
  display: inline-block;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.logout-btn {
  background: transparent;
  border: 2px solid white;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.user-info {
  color: white;
  font-weight: 500;
}

.username {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin-badge {
  background: rgba(255, 215, 0, 0.9);
  color: #2c3e50;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-menu {
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
}
</style>