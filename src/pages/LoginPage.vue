<!-- src/pages/LoginPage.vue -->
<template>
  <div class="page">
    <div class="login-container">
      <!-- Efecto de fondo con gradiente animado -->
      <div class="gradient-bg"></div>

      <!-- Contenedor principal con efecto glassmorphism -->
      <div class="glass-container">
        <div class="content-wrapper">
          <!-- Logo y título -->
          <div class="logo-container">
            <div class="logo-wrapper">
              <img src="/src/assets/images/logo.png" alt="Logo" class="logo" />
            </div>
            <h2>Video Analysis <span class="highlight">Dashboard</span></h2>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="onSubmit" class="login-form">
            <!-- Email Input con ícono -->
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
                    ></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
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

            <!-- Password Input con ícono y toggle -->
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
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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
                <span
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
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
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    ></path>
                    <circle cx="12" cy="12" r="3"></circle>
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
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </span>
              </div>
              <span class="error-message" v-if="errors.password">{{
                errors.password
              }}</span>
            </div>

            <!-- Remember me & Forgot password -->
            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                class="forgot-password"
                @click="showResetDialog = true"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <!-- Login Button -->
            <button type="submit" class="login-btn" :disabled="loading">
              <span class="btn-content" :class="{ loading }">
                <span class="btn-text">{{
                  loading ? "Iniciando sesión..." : "Iniciar sesión"
                }}</span>
                <span class="loader" v-if="loading"></span>
              </span>
            </button>

            <!-- Register Link -->
            <div class="register-link">
              ¿No tienes una cuenta?
              <router-link to="/auth/register">Crear cuenta</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Reset Password Dialog -->
    <div class="modal" v-if="showResetDialog" @click="closeResetDialog">
      <div class="modal-content" @click.stop>
        <h3>Recuperar contraseña</h3>
        <p>
          Ingresa tu correo electrónico y te enviaremos las instrucciones para
          restablecer tu contraseña.
        </p>

        <div class="form-group">
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
                ></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input
              type="email"
              v-model="resetEmail"
              placeholder="Correo electrónico"
              required
            />
          </div>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="closeResetDialog">Cancelar</button>
          <button
            class="reset-btn"
            @click="handleResetPassword"
            :disabled="resetLoading"
          >
            {{ resetLoading ? "Enviando..." : "Enviar instrucciones" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

// src/pages/LoginPage.vue - Actualizar la sección del script
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

// Form state
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const rememberMe = ref(false);

// Reset Password
const showResetDialog = ref(false);
const resetEmail = ref("");
const resetLoading = ref(false);

// Errors state
const errors = reactive({
  email: "",
  password: "",
});

// Clear specific error
const clearError = (field) => {
  errors[field] = "";
};

// Form validation
const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  if (!email.value.trim()) {
    errors.email = "Por favor ingrese su correo electrónico";
    isValid = false;
  }

  if (!password.value.trim()) {
    errors.password = "Por favor ingrese su contraseña";
    isValid = false;
  }

  return isValid;
};

// Form submission
const onSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    await authStore.login(email.value, password.value);

    // Guardar email si "recordarme" está activado
    if (rememberMe.value) {
      localStorage.setItem("rememberedEmail", email.value);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Mostrar notificación de éxito
    $q.notify({
      type: "positive",
      message: "¡Bienvenido de vuelta!",
      position: "top",
    });

    router.push("/");
  } catch (error) {
    errors.email = "Correo electrónico o contraseña incorrectos";

    // Mostrar notificación de error
    $q.notify({
      type: "negative",
      message: "Credenciales incorrectas",
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};

// Reset password
const closeResetDialog = () => {
  showResetDialog.value = false;
  resetEmail.value = "";
};

const handleResetPassword = async () => {
  if (!resetEmail.value) return;

  resetLoading.value = true;
  try {
    // Simular envío de correo de recuperación
    await new Promise((resolve) => setTimeout(resolve, 1000));
    $q.notify({
      type: "positive",
      message: "Se han enviado las instrucciones a tu correo",
      position: "top",
    });
    closeResetDialog();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al enviar las instrucciones",
      position: "top",
    });
  } finally {
    resetLoading.value = false;
  }
};

// Check for remembered email on mount
const rememberedEmail = localStorage.getItem("rememberedEmail");
if (rememberedEmail) {
  email.value = rememberedEmail;
  rememberMe.value = true;
}
</script>
<style scoped>
:root {
  --primary-blue: #0396ff;
  --primary-dark: #0d47a1;
  --error-color: #ef4444;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
}

/* Animaciones */
@keyframes wave1 {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}

@keyframes wave2 {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.85);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: white;
  overflow: hidden;
}

/* Olas del fondo */
.wave-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wave {
  position: absolute;
  left: 0;
  width: 200%;
  height: 100%;
  background-repeat: repeat-x;
  pointer-events: none;
}

.wave-1 {
  bottom: -25%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%230396FF' fill-opacity='0.2'/%3E%3C/svg%3E");
  animation: wave1 15s linear infinite;
  z-index: 1;
}

.wave-2 {
  bottom: -30%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%230D47A1' fill-opacity='0.15'/%3E%3C/svg%3E");
  animation: wave2 17s linear infinite;
  z-index: 0;
}

/* Contenedor principal */
.glass-container {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

/* Logo y título */
.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  display: inline-block;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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
  letter-spacing: -0.025em;
}

.highlight {
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
  margin-bottom: 1.5rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #93a5b6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-icon svg {
  width: 16px;
  height: 16px;
}

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
  box-shadow: 0 0 0 4px rgba(3, 150, 255, 0.1);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #93a5b6;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle svg {
  width: 16px;
  height: 16px;
}

.password-toggle:hover {
  color: var(--primary-blue);
}

/* Opciones de formulario */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

/* Remember me personalizado */
.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.remember-me input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 18px;
  width: 18px;
  background-color: white;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remember-me:hover input ~ .checkmark {
  border-color: var(--primary-blue);
}

.remember-me input:checked ~ .checkmark {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked ~ .checkmark:after {
  display: block;
}

.remember-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Forgot password link */
.forgot-link {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}

.forgot-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Submit button */
.submit-btn {
  width: 100%;
  padding: 0.875rem;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 150, 255, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Register link */
.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.signup-link {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.signup-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Error message */
.error-message {
  color: var(--error-color);
  font-size: 0.813rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.modal-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  background: #edf2f7;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    var(--primary-blue) 0%,
    var(--primary-dark) 100%
  );
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3, 150, 255, 0.2);
}

.reset-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Media queries */
@media (max-width: 640px) {
  .glass-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
<style scoped>
/* Remember me checkbox */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.remember-me input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.remember-me .checkmark {
  position: relative;
  width: 18px;
  height: 18px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remember-me:hover .checkmark {
  border-color: #0396ff;
}

.remember-me input:checked ~ .checkmark {
  background: #0396ff;
  border-color: #0396ff;
}

.remember-me .checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked ~ .checkmark:after {
  display: block;
}

.remember-me span:not(.checkmark) {
  color: #4a5568;
  font-size: 0.875rem;
}

/* Forgot password button */
.forgot-password {
  background: none;
  border: none;
  color: #0396ff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
}

.forgot-password:hover {
  color: #0d47a1;
  text-decoration: underline;
}

/* Login button */
.login-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #0396ff 0%, #0d47a1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 150, 255, 0.2);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

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

/* Register link */
.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #4a5568;
  font-size: 0.875rem;
}

.register-link a {
  color: #0396ff;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.register-link a:hover {
  color: #0d47a1;
  text-decoration: underline;
}

/* Media queries */
@media (max-width: 640px) {
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
