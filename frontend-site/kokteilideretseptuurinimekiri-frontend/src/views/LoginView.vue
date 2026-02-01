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
                        :disabled="loading"
                    />
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn-primary" :disabled="loading">
                    {{ loading ? 'Logis...' : 'Login in' }}
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
            this.errorMessage = '';
            this.successMessage = '';
            this.loading = true;

            try {
                // Temporary simulation
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.successMessage = 'Login was accessful!';
                
                // Moving user to recipes page after successful login
                setTimeout(() => {
                    this.$router.push('/recipes');
                }, 1500);

            } catch (error) {
                this.errorMessage = 'Login failed. Please check your credentials.';
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
/* Main container with cocktail background */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    position: relative;
    
    /* Your cocktail image as background */
    background-image: url('@/assets/wp1989396.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
}

/* Dark overlay */
.login-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6); /* 60% transparent black layer */
    z-index: 1;
}

/* Login card styling */
.login-card {
    position: relative;
    z-index: 2; /* Form stays above the overlay */
    background: rgba(255, 255, 255, 0.95); /* Slight transparency */
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    padding: 45px;
    max-width: 450px;
    width: 100%;
    backdrop-filter: blur(10px); /* Glass-morphism effect */
}

/* Main heading */
.login-card h1 {
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 32px;
    text-align: center;
    font-weight: 700;
}

/* Subtitle text */
.subtitle {
    color: #555;
    margin-bottom: 30px;
    font-size: 16px;
    text-align: center;
}

/* Error message styling */
.error-message {
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #c33;
    font-weight: 500;
}

/* Success message styling */
.success-message {
    background: #efe;
    color: #2a7;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #2a7;
    font-weight: 500;
}

/* Form container */
.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Form group container */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
}

/* Form labels */
.form-group label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 14px;
}

/* Form inputs */
.form-group input {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
    font-family: inherit;
    background: white;
}

/* Input focus state */
.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Disabled input state */
.form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
}

/* Primary button styling */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 14px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 10px;
}

/* Button hover effect */
.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.5);
}

/* Disabled button state */
.btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
}

/* Register link container */
.register-link {
    margin-top: 20px;
    text-align: center;
    color: #555;
    font-size: 14px;
}

/* Register link styling */
.register-link a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
}

/* Register link hover effect */
.register-link a:hover {
    color: #764ba2;
    text-decoration: underline;
}

/* Responsive design for mobile devices */
@media (max-width: 600px) {
    .login-card {
        padding: 35px 25px;
    }

    .login-card h1 {
        font-size: 28px;
    }
    
    .login-container {
        background-attachment: scroll; 
    }
}
</style>