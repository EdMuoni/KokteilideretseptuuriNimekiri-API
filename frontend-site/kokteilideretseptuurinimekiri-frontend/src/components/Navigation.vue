<template>
  <nav class="main-nav">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <router-link to="/" class="brand">Cocktail Recipes</router-link>

      <!-- Navigation Links -->
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>

        <!-- Show these only when logged in -->
        <template v-if="isLoggedIn">
          <router-link to="/recipes">Recipes</router-link>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </template>

        <!-- Show these only when NOT logged in -->
        <template v-else>
          <router-link to="/login" class="login-link">Login</router-link>
          <router-link to="/register" class="register-link">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      isLoggedIn: false
    }
  },
  mounted() {
    this.checkAuthStatus()
    // Listen for login/logout events
    window.addEventListener('storage', this.checkAuthStatus)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkAuthStatus)
  },
  methods: {
    checkAuthStatus() {
      this.isLoggedIn = localStorage.getItem('user') !== null
    },
    async handleLogout() {
      try {
        // Call backend logout endpoint
        await fetch('http://localhost:8080/logout', {
          method: 'POST',
          credentials: 'include'
        })

        // Clear local storage
        localStorage.removeItem('user')
        
        // Update state
        this.isLoggedIn = false

        // Redirect to home
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        // Still clear local data even if backend fails
        localStorage.removeItem('user')
        this.isLoggedIn = false
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.main-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.brand:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  gap: 25px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.3);
}

.register-link {
  background: white;
  color: #667eea !important;
  font-weight: 600;
}

.register-link:hover {
  background: rgba(255, 255, 255, 0.9) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.logout-btn:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
