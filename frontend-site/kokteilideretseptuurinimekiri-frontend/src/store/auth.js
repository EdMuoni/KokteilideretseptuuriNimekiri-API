// src/store/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false
  }),
  
  getters: {
    isAdmin: (state) => state.currentUser?.IsAdmin || false,
    userName: (state) => state.currentUser?.UserName || '',
    userId: (state) => state.currentUser?.UserID || null
  },
  
  actions: {
    // Called after successful login
    login(user) {
      this.currentUser = user
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
      console.log('[Auth Store] User logged in:', user)
    },
    
    // Called on logout - SYNCHRONOUS to immediately update UI
    logout() {
      // Clear state IMMEDIATELY
      this.currentUser = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      
      console.log('[Auth Store] User logged out')
      
      // Destroy backend session (fire and forget)
      fetch('http://localhost:8080/sessions', {
        method: 'DELETE',
        credentials: 'include'
      }).catch(error => console.error('[Auth Store] Logout error:', error))
    },
    
    // Initialize auth state from localStorage on app load
    initializeAuth() {
      const user = localStorage.getItem('user')
      
      if (user) {
        try {
          this.currentUser = JSON.parse(user)
          this.isAuthenticated = true
          console.log('[Auth Store] Restored user from localStorage:', this.currentUser)
        } catch (error) {
          console.error('[Auth Store] Error parsing saved user:', error)
          this.logout()
        }
      } else {
        console.log('[Auth Store] No saved user found')
      }
    }
  }
})