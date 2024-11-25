// components/DashboardFeed.vue
<template>
  <div class="feed-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <q-spinner color="primary" size="3em" />
      <p>Cargando videos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <q-icon name="error_outline" size="4em" color="negative" />
      <p>{{ error }}</p>
      <q-btn color="primary" @click="retryLoading" label="Reintentar" />
    </div>

    <!-- Videos feed -->
    <div v-else class="video-feed" ref="feedContainer" @scroll="handleScroll">
      <div
        v-for="(video, index) in videos"
        :key="video.idVideoGenerado"
        class="video-card"
        :class="{ active: currentVideoIndex === index }"
      >
        <div class="video-wrapper">
          <iframe
            :src="getEmbedUrl(video.linkVideo)"
            frameborder="0"
            allowfullscreen
            allow="autoplay"
            class="video-player"
            :class="{ visible: currentVideoIndex === index }"
          ></iframe>

          <!-- Interaction buttons -->
          <div class="interaction-buttons-vertical">
            <div class="interaction-button">
              <q-btn
                flat
                round
                :color="video.liked ? 'red' : 'white'"
                :icon="video.liked ? 'favorite' : 'favorite_border'"
                @click="toggleLike(video)"
              >
                <q-tooltip>Me gusta</q-tooltip>
              </q-btn>
              <transition name="count" mode="out-in">
                <span
                  class="interaction-count"
                  :key="video.likeCount"
                  v-if="video.likeCount > 0"
                >
                  {{ formatCount(video.likeCount) }}
                </span>
              </transition>
            </div>

            <div class="interaction-button">
              <q-btn
                flat
                round
                :color="video.saved ? 'primary' : 'white'"
                :icon="video.saved ? 'bookmark' : 'bookmark_border'"
                @click="toggleSave(video)"
              >
                <q-tooltip>
                  {{ video.saved ? "Guardado" : "Guardar video" }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Video info -->
          <div class="video-info">
            <div class="info-content">
              <div class="video-title">
                {{ video.title || `Video ${index + 1}` }}
              </div>
              <div class="video-details">
                <span class="category">Categoría {{ video.idCategoria }}</span>
                <span class="duration">{{
                  formatDuration(video.duracion)
                }}</span>
              </div>
              <div class="date">{{ formatDate(video.fechaCreacion) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificación de guardado -->
    <q-dialog v-model="showSaveNotification" position="bottom">
      <q-card class="save-notification">
        <q-card-section class="row items-center">
          <span class="text-h6">Video guardado</span>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            label="Ver guardados"
            @click="goToSaved"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useVideoStore } from "src/stores/video";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const videoStore = useVideoStore();
const feedContainer = ref(null);
const currentVideoIndex = ref(0);
const showSaveNotification = ref(false);
let scrollTimeout = null;

// Computed properties
const videos = computed(() => videoStore.videos);
const loading = computed(() => videoStore.loading);
const error = computed(() => videoStore.error);

// Methods
const getEmbedUrl = (url) => {
  console.log("Original URL:", url);
  const videoId = url.match(/[-\w]{25,}/)?.[0];
  const embedUrl = `https://drive.google.com/file/d/${videoId}/preview`;
  console.log("Embed URL:", embedUrl);
  return embedUrl;
};

// Añadir función para formatear el contador
const formatCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return "Fecha no disponible";
  }
};

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const handleScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    if (!feedContainer.value) return;

    const containerHeight = feedContainer.value.clientHeight;
    const scrollPosition = feedContainer.value.scrollTop;
    const newIndex = Math.round(scrollPosition / containerHeight);

    if (newIndex !== currentVideoIndex.value) {
      currentVideoIndex.value = newIndex;
      snapToVideo(newIndex);
    }
  }, 50);
};

const snapToVideo = (index) => {
  if (!feedContainer.value) return;
  const containerHeight = feedContainer.value.clientHeight;
  feedContainer.value.scrollTo({
    top: containerHeight * index,
    behavior: "smooth",
  });
};

// Función actualizada de toggleLike
const toggleLike = (video) => {
  // Guardamos el estado anterior
  const wasLiked = video.liked;
  videoStore.toggleLike(video.idVideoGenerado);
};

const toggleSave = (video) => {
  // Guardamos el estado anterior
  const wasSaved = video.saved;
  videoStore.toggleSave(video.idVideoGenerado);

  // Mostramos la notificación correspondiente
  if (!wasSaved) {
    // Si no estaba guardado antes
    $q.notify({
      message: "Video añadido a guardados",
      color: "positive",
      icon: "bookmark",
      position: "top",
      timeout: 2000,
    });
  } else {
    // Si ya estaba guardado
    $q.notify({
      message: "Video eliminado de guardados",
      color: "negative",
      icon: "bookmark_border",
      position: "top",
      timeout: 2000,
    });
  }
};

const goToSaved = () => {
  showSaveNotification.value = false;
  router.push("/guardados");
};

const retryLoading = () => {
  videoStore.fetchVideos();
};

onMounted(() => {
  // Verificar si los videos están cargados
  if (!videos.value.length) {
    videoStore.fetchVideos();
  }
});

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>

<style scoped>
.feed-container {
  height: calc(100vh - 100px);
  background: #000;
  position: relative;
}

.loading-state,
.error-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  gap: 1rem;
}

.loading-state p,
.error-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
  opacity: 0.8;
}

.video-feed {
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.video-feed::-webkit-scrollbar {
  display: none;
}

.video-card {
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
}

.video-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #000;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
}

.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  z-index: 2;
}

.info-content {
  max-width: 600px;
  margin: 0 auto;
}

.video-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.video-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.category {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.duration {
  font-size: 0.9rem;
  opacity: 0.8;
}

.date {
  font-size: 0.8rem;
  opacity: 0.7;
}

.interaction-buttons-vertical {
  position: absolute;
  right: 16px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2;
}

.interaction-button {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.interaction-count {
  color: white;
  font-size: 12px;
  margin-top: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Estilo para botones de interacción */
.interaction-button .q-btn {
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.interaction-button .q-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.video-card.active {
  animation: fadeIn 0.3s ease-out;
}

.video-info {
  animation: slideUp 0.3s ease-out;
}

/* Estados de carga y error */
.loading-state .q-spinner {
  margin-bottom: 1rem;
}

.error-state .q-icon {
  margin-bottom: 1rem;
}

/* Estilos para la notificación de guardado */
.save-notification {
  background: white;
  border-radius: 8px;
  margin: 16px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive design */
@media (max-width: 768px) {
  .video-info {
    padding: 16px;
  }

  .video-title {
    font-size: 1rem;
  }

  .interaction-buttons-vertical {
    right: 8px;
    bottom: 80px;
  }

  .category {
    font-size: 0.8rem;
    padding: 3px 6px;
  }

  .duration,
  .date {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .interaction-buttons-vertical {
    right: 4px;
    bottom: 60px;
    gap: 12px;
  }

  .video-info {
    padding: 12px;
  }

  .info-content {
    width: 100%;
  }

  .save-notification {
    min-width: auto;
    margin: 8px;
    width: calc(100% - 16px);
  }
}

/* Transiciones suaves */
.video-player,
.video-info,
.interaction-buttons-vertical {
  transition: all 0.3s ease;
}

/* Efecto hover para los botones */
.q-btn {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.q-btn:hover {
  transform: scale(1.05);
}

/* Estilos para el modo oscuro */
@media (prefers-color-scheme: dark) {
  .save-notification {
    background: #1d1d1d;
    color: white;
  }
}

.interaction-count {
  color: white;
  font-size: 12px;
  margin-top: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.interaction-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Animación para el contador */
@keyframes countPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.interaction-count {
  animation: countPop 0.3s ease-out;
}

/* Añade estos estilos a la sección <style> de tu componente */

.count-enter-active,
.count-leave-active {
  transition: all 0.3s ease;
}

.count-enter-from,
.count-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.count-enter-to,
.count-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.interaction-count {
  color: white;
  font-size: 12px;
  margin-top: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  position: relative;
}
</style>
