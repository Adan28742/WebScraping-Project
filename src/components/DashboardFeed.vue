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
      <p>{{ error }}</p>
      <q-btn color="primary" @click="retryLoading">Reintentar</q-btn>
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
          <!-- Debug info -->
          <div
            class="debug-info"
            style="
              position: absolute;
              top: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              padding: 5px;
              z-index: 10;
            "
          >
            Video ID: {{ video.idVideoGenerado }}
          </div>

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
                icon="favorite"
                @click="toggleLike(video)"
              >
                <q-tooltip>Me gusta</q-tooltip>
              </q-btn>
              <span class="interaction-count">{{ video.likes || 0 }}</span>
            </div>

            <div class="interaction-button">
              <q-btn
                flat
                round
                :color="video.saved ? 'primary' : 'white'"
                icon="bookmark"
                @click="toggleSave(video)"
              >
                <q-tooltip>Guardar</q-tooltip>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useVideoStore } from "src/stores/video";
import { useQuasar } from "quasar";

const $q = useQuasar();
const videoStore = useVideoStore();
const feedContainer = ref(null);
const currentVideoIndex = ref(0);
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

const toggleLike = (video) => {
  videoStore.toggleLike(video.idVideoGenerado);
  if (video.liked) {
    $q.notify({
      message: "Video añadido a Me gusta",
      color: "positive",
      icon: "favorite",
    });
  }
};

const toggleSave = (video) => {
  videoStore.toggleSave(video.idVideoGenerado);
  if (video.saved) {
    $q.notify({
      message: "Video guardado",
      color: "positive",
      icon: "bookmark",
    });
  }
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
}

.video-feed {
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
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
}
</style>
