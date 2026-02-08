<template>
  <div class="register-container">
    <div class="register-card">
      <!-- Page title -->
      <h1>Register</h1>
      <p class="subtitle">Create your account</p>
      
      <!-- Error message display -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Success message display -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Registration form -->
      <form @submit.prevent="handleRegister" class="register-form">
        
        <!-- Full Name input -->
        <div class="form-group">
          <label for="fullName">Full Name: *</label>
          <input
            type="text"
            id="fullName"
            v-model="formData.FullName"
            placeholder="John Smith"
            required
            minlength="2"
            maxlength="100"
            :disabled="loading"
          />
        </div>

        <!-- Email input -->
        <div class="form-group">
          <label for="email">Email: *</label>
          <input
            type="email"
            id="email"
            v-model="formData.EmailAddress"
            placeholder="john.smith@example.com"
            required
            :disabled="loading"
          />
        </div>

        <!-- Username input -->
        <div class="form-group">
          <label for="username">Username: *</label>
          <input
            type="text"
            id="username"
            v-model="formData.UserName"
            placeholder="johnsmith"
            required
            minlength="3"
            maxlength="30"
            pattern="[a-zA-Z0-9_-]+"
            title="Only letters, numbers, underscore and hyphen"
            :disabled="loading"
          />
        </div>

        <!-- Password input -->
        <div class="form-group">
          <label for="password">Password: *</label>
          <input
            type="password"
            id="password"
            v-model="formData.PasswordHASH"
            placeholder="At least 8 characters"
            required
            minlength="8"
            :disabled="loading"
          />
        </div>

        <!-- Confirm Password input -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password: *</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Repeat password"
            required
            :disabled="loading"
          />
        </div>

        <!-- Phone Number input (optional) -->
        <div class="form-group">
          <label for="phone">Phone Number (optional):</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.PhoneNumber2FA"
            placeholder="+1234567890"
            :disabled="loading"
          />
        </div>

        <!-- Submit button -->
        <button 
          type="submit" 
          class="btn-primary" 
          :disabled="loading"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <!-- Login link -->
      <div class="login-link">
        <p>
          Already have an account? 
          <router-link to="/login">Sign in here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      // Form data object matching backend API requirements
      formData: {
        FullName: '',
        EmailAddress: '',
        UserName: '',
        PasswordHASH: '',
        PhoneNumber2FA: '',
        IsAdmin: false 
      },
      confirmPassword: '', 
      loading: false, 
      errorMessage: '', 
      successMessage: '' 
    };
  },
  methods: {
    async handleRegister() {
      // Clear previous messages
      this.errorMessage = '';
      this.successMessage = '';

      if (this.formData.PasswordHASH !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(this.formData.PasswordHASH)) {
        this.errorMessage = 'Password must contain at least one lowercase letter, one uppercase letter, and one number!';
        return;
      }

      // Set loading state
      this.loading = true;

      try {
        // Send POST request to backend registration endpoint
        const response = await fetch('http://localhost:8080/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });

        // Parse response JSON
        const data = await response.json();

        if (response.ok) {
          // Registration successful
          this.successMessage = 'Registration successful! Redirecting...';

          // Save JWT token and user data to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect to recipes page after 1.5 seconds
          setTimeout(() => {
            this.$router.push('/recipes');
          }, 1500);

        } else {
          // Registration failed - display error from backend
          this.errorMessage = data.error || 'Registration failed';
        }

      } catch (error) {
        // Network error or other exception
        console.error('Register error:', error);
        this.errorMessage = 'Connection error. Please check if the backend is running.';
      } finally {
        // Reset loading state
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;

    background-image: url('@/assets/wp1989396.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

.register-card {
  background: rgb(193, 166, 207);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

.register-card h1 {
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 32px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
  font-weight: 500;
}

.success-message {
  background: #efe;
  color: #2a7;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #2a7;
  font-weight: 500;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-group small {
  color: #666;
  font-size: 12px;
}

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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Disabled button state */
.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Login link container */
.login-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

/* Login link styling */
.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

/* Login link hover effect */
.login-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

</style>