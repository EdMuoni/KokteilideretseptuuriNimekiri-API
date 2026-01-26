<template>
    <div class="login-container">
        <div class="login-card">
            <!-- Page title -->
            <h1>Login</h1>
            <p class="subtitle">Login to your account</p>

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
        </div>
    </div>
</template>

<style scoped>
/* Main container with centered content */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Login card with shadow */
.login-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 40px;
    max-width: 500px;
    width: 100%;
}

/* Main heading */
.login-card h1 {
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 32px;
}

/* Subtitle text */
.subtitle {
    color: #666;
    margin-bottom: 30px;
    font-size: 16px;
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

/* Helper text below inputs */
.form-group small {
    color: #666;
    font-size: 12px;
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

/* Responsive design for mobile devices */
@media (max-width: 600px) {
    .login-card {
        padding: 30px 20px;
    }

    .login-card h1 {
        font-size: 28px;
    }
}
</style>