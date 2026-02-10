<template>
    <div class="login-container">
        <div class="login-card">

            <h1>Welcome Back!</h1>
            <p class="subtitle">Log in to see our cocktail recipes</p>

            <!-- Error/Success messages -->
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="success-message">
                {{ successMessage }}
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="login-form">

                <!-- Email input -->
                <div class="form-group">
                    <label for="email">E-mail: *</label>
                    <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        placeholder="Enter your email address"
                        required
                        autocomplete="email"
                        :disabled="loading"
                    />
                </div>

                <!-- Password input -->
                <div class="form-group">
                    <label for="password">Password: *</label>
                    <input
                        type="password"
                        id="password"
                        v-model="formData.password"
                        placeholder="At least 8 characters long"
                        required
                        minlength="8"
                        autocomplete="current-password"
                        :disabled="loading"
                    />
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn-primary" :disabled="loading">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>
            </form>

            <!-- Register link -->
            <div class="register-link">
                Haven't registered yet? <router-link to="/register">Register here</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            loading: false,
            errorMessage: '',
            successMessage: ''
        }
    },
    methods: {
        async handleLogin() {
            // Reset messages
            this.errorMessage = '';
            this.successMessage = '';
            this.loading = true;

            console.log('[Login] Starting login process');

            try {
                // Make API request to backend
                const response = await fetch('http://localhost:8080/sessions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',  
                    body: JSON.stringify({
                        LoginEmail: this.formData.email,      
                        LoginPassword: this.formData.password  
                    })
                });

                console.log('[Login] Response status:', response.status);

                // Parse response data
                const data = await response.json();
                console.log('[Login] Response data:', data);

                if (response.ok) {
                    console.log('[Login] Login successful');
                    
                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(data));
                    
                    // Show success message
                    this.successMessage = 'Login successful! Redirecting...';
                    
                    // Redirect to recipes page
                    console.log('[Login] Redirecting to /recipes');
                    this.$router.push('/recipes');
                    
                } else {
                    // Login failed
                    console.error('[Login] Login failed:', data.error);
                    this.errorMessage = data.error || 'Login failed. Please try again.';
                }

            } catch (error) {
                // Network or other error occurred
                console.error('[Login] Error occurred:', error);
                this.errorMessage = 'An error occurred. Please try again.';
                
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;

    background-image: url('@/assets/wp1989396.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

.login-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 60px 50px;
    max-width: 450px;
    width: 100%;
}

h1 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 32px;
    text-align: center;
}

.subtitle {
    color: #666;
    text-align: center;
    margin-bottom: 40px;
    font-size: 16px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-group input {
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s;
    font-family: inherit;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 16px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 10px;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-message {
    background-color: #fee;
    color: #c33;
    padding: 15px;
    border-radius: 10px;
    border-left: 4px solid #c33;
    margin-bottom: 20px;
    font-size: 14px;
}

.success-message {
    background-color: #efe;
    color: #2a2;
    padding: 15px;
    border-radius: 10px;
    border-left: 4px solid #2a2;
    margin-bottom: 20px;
    font-size: 14px;
}

.register-link {
    text-align: center;
    margin-top: 30px;
    color: #666;
    font-size: 14px;
}

.register-link a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s;
}

.register-link a:hover {
    color: #764ba2;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .login-card {
        padding: 40px 30px;
    }
    
    h1 {
        font-size: 28px;
    }
}
</style>