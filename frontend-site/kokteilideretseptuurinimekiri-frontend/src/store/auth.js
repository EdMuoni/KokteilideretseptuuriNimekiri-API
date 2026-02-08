// src/store/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.currentUser?.IsAdmin || false,
    userName: (state) => state.currentUser?.UserName || '',
    userId: (state) => state.currentUser?.UserID || null
  },
  
  actions: {
    setAuth(token, user) {
      this.token = token
      this.currentUser = user
      
      // Persist to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    logout() {
      this.token = null
      this.currentUser = null
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    // Check if token is still valid
    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.token = token
        this.currentUser = JSON.parse(user)
        return true
      }
      
      this.logout()
      return false
    }
  }
})