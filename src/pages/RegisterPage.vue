<!-- src/pages/RegisterPage.vue -->
<template>
  <div class="page">
    <div class="register-container">
      <!-- Logo y título -->
      <div class="logo-container">
        <div class="logo-wrapper">
          <img src="/src/assets/images/logo.png" alt="Logo" class="logo" />
        </div>
        <h2>Crear <span class="highlight">Cuenta</span></h2>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="onSubmit" class="register-form">
        <!-- Nombres Input -->
        <div class="form-group" :class="{ 'has-error': errors.nombres }">
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              v-model="nombres"
              placeholder="Nombres"
              required
              :class="{ 'input-error': errors.nombres }"
              @focus="clearError('nombres')"
            />
          </div>
          <span class="error-message" v-if="errors.nombres">{{
            errors.nombres
          }}</span>
        </div>

        <!-- Apellidos Input -->
        <div class="form-group" :class="{ 'has-error': errors.apellidos }">
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              v-model="apellidos"
              placeholder="Apellidos"
              required
              :class="{ 'input-error': errors.apellidos }"
              @focus="clearError('apellidos')"
            />
          </div>
          <span class="error-message" v-if="errors.apellidos">{{
            errors.apellidos
          }}</span>
        </div>

        <!-- Email Input -->
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              type="email"
              v-model="email"
              placeholder="Correo electrónico"
              required
              :class="{ 'input-error': errors.email }"
              @focus="clearError('email')"
            />
          </div>
          <span class="error-message" v-if="errors.email">{{
            errors.email
          }}</span>
        </div>

        <!-- Password Input -->
        <div class="form-group" :class="{ 'has-error': errors.password }">
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Contraseña"
              required
              :class="{ 'input-error': errors.password }"
              @focus="clearError('password')"
            />
            <span class="password-toggle" @click="showPassword = !showPassword">
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </span>
          </div>
          <span class="error-message" v-if="errors.password">{{
            errors.password
          }}</span>
        </div>

        <!-- Confirm Password Input -->
        <div
          class="form-group"
          :class="{ 'has-error': errors.confirmPassword }"
        >
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirmar contraseña"
              required
              :class="{ 'input-error': errors.confirmPassword }"
              @focus="clearError('confirmPassword')"
            />
            <span
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg
                v-if="!showConfirmPassword"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </span>
          </div>
          <span class="error-message" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</span>
        </div>

        <!-- Register Button -->
        <button type="submit" class="register-btn" :disabled="loading">
          <span class="btn-content" :class="{ loading: loading }">
            <span class="btn-text">{{
              loading ? "Registrando..." : "Crear cuenta"
            }}</span>
            <span class="loader" v-if="loading"></span>
          </span>
        </button>

        <!-- Login Link -->
        <div class="login-link">
          ¿Ya tienes una cuenta?
          <router-link to="/auth/login">Iniciar sesión</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

// RegisterPage.vue - script section
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from "quasar";

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

// Form fields
const nombres = ref("");
const apellidos = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// UI state
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

// Errors state
const errors = reactive({
  nombres: "",
  apellidos: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Clear specific error
const clearError = (field) => {
  errors[field] = "";
};

// Form validation
const validateForm = () => {
  let isValid = true;

  // Reset all errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  // Nombres validation
  if (nombres.value.length < 2) {
    errors.nombres = "Por favor ingrese sus nombres";
    isValid = false;
  }

  // Apellidos validation
  if (apellidos.value.length < 2) {
    errors.apellidos = "Por favor ingrese sus apellidos";
    isValid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errors.email = "Por favor ingrese un correo electrónico válido";
    isValid = false;
  }

  // Password validation
  if (password.value.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
    isValid = false;
  }

  // Confirm password validation
  if (password.value !== confirmPassword.value) {
    errors.confirmPassword = "Las contraseñas no coinciden";
    isValid = false;
  }

  return isValid;
};

const onSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    await authStore.register({
      nombres: nombres.value,
      apellidos: apellidos.value,
      email: email.value,
      password: password.value,
    });

    $q.notify({
      type: "positive",
      message: "Cuenta creada exitosamente",
      position: "top",
    });

    router.push("/auth/login");
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error.message,
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
:root {
  --primary-blue: #0396ff;
  --primary-dark: #0d47a1;
  --error-color: #ef4444;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
}

/* Container principal */
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 2rem 1rem;
}

.register-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Logo y título */
.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.logo {
  max-width: 150px;
  height: auto;
}

h2 {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.highlight {
  color: var(--primary-blue);
  position: relative;
  display: inline-block;
  background: linear-gradient(
    135deg,
    var(--primary-blue) 0%,
    var(--primary-dark) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Formulario */
.form-group {
  margin-bottom: 1.25rem;
}

.input-wrapper {
  position: relative;
}

/* Ícono de entrada */
.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #93a5b6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.input-icon svg {
  width: 16px;
  height: 16px;
}

/* Campos de entrada */
input {
  width: 100%;
  padding: 0.875rem 2.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.938rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
  background: white;
}

input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(3, 150, 255, 0.1);
}

/* Toggle de contraseña */
.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #93a5b6;
  background: none;
  border: none;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--primary-blue);
}

.password-toggle svg {
  width: 16px;
  height: 16px;
}

/* Botón de registro */
.register-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    var(--primary-blue) 0%,
    var(--primary-dark) 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 150, 255, 0.2);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-text {
  color: white;
  font-weight: 600;
}

/* Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Link de inicio de sesión */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.login-link a {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Mensajes de error */
.error-message {
  color: var(--error-color);
  font-size: 0.813rem;
  margin-top: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Input con error */
.input-error {
  border-color: var(--error-color);
}

.input-error:focus {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Estados de carga y deshabilitado */
.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Media queries */
@media (max-width: 640px) {
  .register-container {
    padding: 1.5rem;
  }

  input {
    font-size: 1rem;
  }

  .register-btn {
    padding: 0.875rem;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-container {
  animation: fadeIn 0.3s ease-out;
}
</style>
<style scoped>
/* Corrección del título y la palabra "Cuenta" */
h2 {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.highlight {
  color: #0396ff; /* Fallback por si el gradiente no funciona */
  background: linear-gradient(135deg, #0396ff 0%, #0d47a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

/* Corrección del botón de registro */
.register-btn {
  width: 100%;
  padding: 1rem;
  background: #0396ff;
  background: linear-gradient(135deg, #0396ff 0%, #0d47a1 100%);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-text {
  color: #ffffff !important; /* Forzar color blanco */
  font-weight: 600;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 150, 255, 0.2);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Corrección del link de inicio de sesión */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #4a5568;
  font-size: 0.875rem;
}

.login-link a {
  color: #0396ff !important; /* Forzar color */
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: #0d47a1 !important;
  text-decoration: underline;
}
</style>
