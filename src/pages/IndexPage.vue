<!-- src/pages/IndexPage.vue -->
<template>
  <div class="dashboard">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">News Analysis Dashboard</div>
      <div class="nav-links">
        <span class="username">{{ nombreCompleto }}</span>
        <button class="logout-btn" @click="logout">Cerrar Sesión</button>
      </div>
    </nav>

    <!-- Content -->
    <div class="dashboard-content">
      <!-- Sección de Búsqueda -->
      <div class="search-section">
        <h3>Búsqueda de Noticias</h3>
        <div class="search-card">
          <div class="search-form">
            <div class="form-group">
              <label>Término de búsqueda</label>
              <input
                type="text"
                v-model="searchConfig.query"
                placeholder="Ej: noticias, news..."
                :disabled="isProcessing"
              />
            </div>

            <div class="form-group">
              <label>Cantidad de videos</label>
              <input
                type="number"
                v-model="searchConfig.limit"
                min="1"
                max="20"
                :disabled="isProcessing"
              />
            </div>

            <div class="filters">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="searchConfig.onlyLive"
                  :disabled="isProcessing"
                />
                Solo transmisiones en vivo
              </label>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="searchConfig.recentOnly"
                  :disabled="isProcessing"
                />
                Solo videos recientes
              </label>
            </div>

            <button
              class="search-btn"
              @click="startAnalysis"
              :disabled="isProcessing"
            >
              {{ isProcessing ? "Procesando..." : "Iniciar Análisis" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="progress-section" v-if="isProcessing">
        <div class="progress-card">
          <h4>Estado del Proceso</h4>
          <div class="progress-steps">
            <div
              class="step"
              :class="{ active: currentStep >= 1, completed: currentStep > 1 }"
            >
              <div class="step-number">1</div>
              <div class="step-label">Búsqueda de Videos</div>
            </div>
            <div
              class="step"
              :class="{ active: currentStep >= 2, completed: currentStep > 2 }"
            >
              <div class="step-number">2</div>
              <div class="step-label">Descarga</div>
            </div>
            <div
              class="step"
              :class="{ active: currentStep >= 3, completed: currentStep > 3 }"
            >
              <div class="step-number">3</div>
              <div class="step-label">Extracción de Frames</div>
            </div>
            <div
              class="step"
              :class="{ active: currentStep >= 4, completed: currentStep > 4 }"
            >
              <div class="step-number">4</div>
              <div class="step-label">Análisis ML</div>
            </div>
            <div
              class="step"
              :class="{ active: currentStep >= 5, completed: currentStep > 5 }"
            >
              <div class="step-number">5</div>
              <div class="step-label">Generación de Clips</div>
            </div>
          </div>
          <div class="progress-details" v-if="currentProgress">
            {{ currentProgress }}
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-section" v-if="analysisResults.length > 0">
        <h3>Resultados del Análisis</h3>
        <div class="results-grid">
          <div
            v-for="(result, index) in analysisResults"
            :key="index"
            class="result-card"
          >
            <div class="result-header">
              <span class="result-title">Cluster {{ index + 1 }}</span>
              <span class="result-date">{{ result.timestamp }}</span>
            </div>
            <div class="result-content">
              <div class="frames-preview">
                <img
                  :src="result.keyFrame"
                  alt="Frame clave"
                  class="key-frame"
                />
              </div>
              <div class="result-actions">
                <button class="download-btn" @click="downloadClip(result)">
                  Descargar Clip
                </button>
                <button class="preview-btn" @click="previewClip(result)">
                  Vista Previa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div class="modal" v-if="showPreview" @click="showPreview = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>Vista Previa del Clip</h4>
          <button class="close-btn" @click="showPreview = false">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <video ref="previewVideo" controls>
            <source :src="currentPreviewUrl" type="video/mp4" />
            Tu navegador no soporta la reproducción de videos.
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const userProfile = authStore.getUserProfile();

// Computed
const nombreCompleto = computed(() => {
  return `${userProfile.nombres} ${userProfile.apellidos}`;
});

// Estado
const searchConfig = ref({
  query: "noticias",
  limit: 5,
  onlyLive: false,
  recentOnly: true,
});

const isProcessing = ref(false);
const currentStep = ref(0);
const currentProgress = ref("");
const analysisResults = ref([]);
const showPreview = ref(false);
const currentPreviewUrl = ref("");

// Funciones
const logout = () => {
  authStore.logout();
  router.push("/login");
};

const startAnalysis = async () => {
  isProcessing.value = true;
  currentStep.value = 1;
  analysisResults.value = [];

  try {
    // Simular el proceso
    await simulateStep(1, "Buscando videos...");
    await simulateStep(2, "Descargando videos...");
    await simulateStep(3, "Extrayendo frames...");
    await simulateStep(4, "Analizando contenido...");
    await simulateStep(5, "Generando clips...");

    // Simular resultados
    analysisResults.value = generateMockResults();
  } catch (error) {
    console.error(error);
    alert("Error en el proceso de análisis");
  } finally {
    isProcessing.value = false;
    currentStep.value = 0;
    currentProgress.value = "";
  }
};

const simulateStep = async (step, message) => {
  currentStep.value = step;
  currentProgress.value = message;
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const generateMockResults = () => {
  return Array(3)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      timestamp: new Date().toLocaleString(),
      keyFrame: `/api/placeholder/300/200`,
      clipUrl: "#",
      cluster: i + 1,
    }));
};

const downloadClip = (result) => {
  // Aquí iría la lógica de descarga
  alert(`Descargando clip del cluster ${result.cluster}`);
};

const previewClip = (result) => {
  currentPreviewUrl.value = result.clipUrl;
  showPreview.value = true;
};
</script>
<style scoped>
/* Variables */
:root {
  --primary-color: #1976d2;
  --primary-dark: #1565c0;
  --success-color: #2ecc71;
  --warning-color: #f1c40f;
  --danger-color: #e74c3c;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
  --border-color: #e2e8f0;
  --bg-gray: #f8fafc;
}

/* Layout Base */
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Navbar */
.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
  color: var(--text-primary);
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  filter: brightness(90%);
  transform: translateY(-1px);
}

/* Content Layout */
.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Sección de Búsqueda */
.search-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.search-card {
  background: var(--bg-gray);
  border-radius: 8px;
  padding: 1.5rem;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
}

.search-btn {
  padding: 0.875rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Progress Section */
.progress-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-card {
  padding: 1rem;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  position: relative;
}

.progress-steps::before {
  content: "";
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--border-color);
  z-index: 1;
}

.step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.step.completed .step-number {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}

.progress-details {
  text-align: center;
  color: var(--text-secondary);
  margin-top: 1rem;
  font-size: 0.875rem;
}

/* Results Section */
.results-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.result-card {
  background: var(--bg-gray);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.result-title {
  font-weight: 600;
  color: var(--text-primary);
}

.result-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.result-content {
  padding: 1rem;
}

.frames-preview {
  margin-bottom: 1rem;
}

.key-frame {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.download-btn,
.preview-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn {
  background: var(--primary-color);
  color: white;
}

.preview-btn {
  background: var(--bg-gray);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.download-btn:hover {
  background: var(--primary-dark);
}

.preview-btn:hover {
  background: #e2e8f0;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 1rem;
}

.modal-body video {
  width: 100%;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }

  .progress-steps {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .progress-steps::before {
    display: none;
  }

  .step {
    flex-direction: row;
    width: 100%;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<style scoped>
/* Layout Base */
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Navbar */
.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
  color: #2d3748;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

/* Content Layout */
.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Sección de Búsqueda */
.search-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
}

.search-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group input[type="text"],
.form-group input[type="number"] {
  border: 1px solid #cbd5e0;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
}

.search-btn {
  padding: 0.875rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  background: #1565c0;
  transform: translateY(-1px);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Progress Section */
.progress-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  position: relative;
}

.progress-steps::before {
  content: "";
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #1976d2;
  border-color: #1976d2;
  color: white;
}

.step.completed .step-number {
  background: #2ecc71;
  border-color: #2ecc71;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: #4a5568;
  text-align: center;
}

.progress-details {
  text-align: center;
  color: #4a5568;
  margin-top: 1rem;
  font-size: 0.875rem;
}

/* Results Section */
.results-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.result-card {
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.result-title {
  font-weight: 600;
  color: #2d3748;
}

.result-date {
  font-size: 0.75rem;
  color: #4a5568;
}

.result-content {
  padding: 1rem;
}

.frames-preview {
  margin-bottom: 1rem;
}

.key-frame {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.download-btn,
.preview-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn {
  background: #1976d2;
  color: white;
}

.preview-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #2d3748;
}

.download-btn:hover {
  background: #1565c0;
}

.preview-btn:hover {
  background: #e2e8f0;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4a5568;
}

.modal-body {
  padding: 1rem;
}

.modal-body video {
  width: 100%;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }

  .progress-steps {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .progress-steps::before {
    display: none;
  }

  .step {
    flex-direction: row;
    width: 100%;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
