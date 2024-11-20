<!-- src/pages/IndexPage.vue -->
<template>
  <div class="feed-container">
    <div class="video-feed" ref="feedContainer" @scroll="handleScroll">
      <div
        v-for="(video, index) in videos"
        :key="video.idVideoGenerado"
        class="video-card"
        :class="{ active: currentVideoIndex === index }"
        :ref="
          (el) => {
            if (el) videoRefs[index] = el;
          }
        "
      >
        <div class="video-wrapper">
          <iframe
            :src="getEmbedUrl(video.linkVideo)"
            frameborder="0"
            allowfullscreen
            class="video-player"
            :class="{ visible: currentVideoIndex === index }"
          ></iframe>

          <!-- Botones de interacción verticales -->
          <div class="interaction-buttons-vertical">
            <div class="interaction-button">
              <q-btn
                flat
                round
                :color="video.liked ? 'red' : 'white'"
                icon="favorite"
                @click.stop="toggleLike(video)"
              >
                <q-tooltip>Me gusta</q-tooltip>
              </q-btn>
              <span class="interaction-count">{{ video.likes || 0 }}</span>
            </div>

            <div class="interaction-button">
              <q-btn
                flat
                round
                color="white"
                icon="comment"
                @click.stop="openComments(video)"
              >
                <q-tooltip>Comentarios</q-tooltip>
              </q-btn>
              <span class="interaction-count">{{
                video.comments?.length || 0
              }}</span>
            </div>

            <div class="interaction-button">
              <q-btn
                flat
                round
                :color="video.saved ? 'primary' : 'white'"
                icon="bookmark"
                @click.stop="toggleSave(video)"
              >
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>
            </div>

            <div class="interaction-button">
              <q-btn
                flat
                round
                color="white"
                icon="share"
                @click.stop="shareVideo(video)"
              >
                <q-tooltip>Compartir</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Información del video -->
          <div class="video-info">
            <div class="info-content">
              <div class="video-title">Video {{ video.idVideoGenerado }}</div>
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

    <!-- Dialog de comentarios -->
    <q-dialog v-model="showComments" position="right" maximized>
      <q-card class="comments-dialog">
        <q-card-section class="row items-center q-py-sm">
          <div class="text-h6">Comentarios</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="comments-list q-pa-none">
          <q-scroll-area style="height: calc(100vh - 150px)">
            <div class="q-pa-md">
              <template v-if="currentVideo?.comments?.length">
                <div
                  v-for="comment in currentVideo.comments"
                  :key="comment.id"
                  class="comment q-mb-md"
                >
                  <div class="comment-header">
                    <q-avatar size="32px">
                      <img :src="comment.avatar" :alt="comment.username" />
                    </q-avatar>
                    <div class="comment-info">
                      <div class="username">{{ comment.username }}</div>
                      <div class="comment-date">
                        {{ formatCommentDate(comment.date) }}
                      </div>
                    </div>
                  </div>
                  <div class="comment-content">{{ comment.text }}</div>
                </div>
              </template>
              <div v-else class="text-center q-pa-md text-grey">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-separator />

        <q-card-section class="comment-input">
          <q-input
            v-model="newComment"
            outlined
            rounded
            dense
            placeholder="Escribe un comentario..."
            bg-color="white"
            @keyup.enter="addComment"
          >
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                color="primary"
                icon="send"
                @click="addComment"
                :disable="!newComment.trim()"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog de compartir -->
    <q-dialog v-model="showShare">
      <q-card style="width: 300px">
        <q-card-section class="row items-center">
          <div class="text-h6">Compartir video</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="share-options">
            <q-btn
              class="share-btn"
              flat
              color="primary"
              icon="content_copy"
              label="Copiar enlace"
              @click="copyLink"
            />
            <q-btn
              class="share-btn"
              flat
              color="blue"
              icon="facebook"
              label="Facebook"
            />
            <q-btn
              class="share-btn"
              flat
              color="light-blue"
              icon="twitter"
              label="Twitter"
            />
            <q-btn
              class="share-btn"
              flat
              color="green"
              icon="whatsapp"
              label="WhatsApp"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useVideoStore } from "stores/video";

const $q = useQuasar();
const videoStore = useVideoStore();
const feedContainer = ref(null);
const videoRefs = ref([]);
const currentVideoIndex = ref(0);
let scrollTimeout = null;

const videos = computed(() => videoStore.videos);
const userProfile = computed(() => videoStore.userProfile);

const showComments = ref(false);
const showShare = ref(false);
const currentVideo = ref(null);
const newComment = ref("");

const getEmbedUrl = (url) => {
  const fileId = url.match(/\/d\/(.*?)\/view/)?.[1];
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatCommentDate = (date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  if (!feedContainer.value || !videoRefs.value[index]) return;

  const containerHeight = feedContainer.value.clientHeight;
  const targetPosition = containerHeight * index;

  feedContainer.value.scrollTo({
    top: targetPosition,
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

const openComments = (video) => {
  currentVideo.value = video;
  showComments.value = true;
};

const addComment = () => {
  if (!newComment.value.trim()) return;

  videoStore.addComment(currentVideo.value.idVideoGenerado, newComment.value);
  newComment.value = "";

  $q.notify({
    message: "Comentario añadido",
    color: "positive",
  });
};

const shareVideo = (video) => {
  currentVideo.value = video;
  showShare.value = true;
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(currentVideo.value.linkVideo);
    $q.notify({
      message: "Enlace copiado al portapapeles",
      color: "positive",
    });
    showShare.value = false;
  } catch (err) {
    $q.notify({
      message: "Error al copiar el enlace",
      color: "negative",
    });
  }
};

onMounted(() => {
  if (window.matchMedia("(hover: none)").matches) {
    // Es un dispositivo táctil
    document.body.style.overscrollBehavior = "none";
  }
});

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  document.body.style.overscrollBehavior = "";
});
</script>

<style scoped>
.feed-container {
  height: calc(100vh - 50px);
  background: #000;
  position: relative;
  overflow: hidden;
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
  overflow: hidden;
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
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.video-player.visible {
  opacity: 1;
}

/* Botones de interacción verticales */
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
  color: white;
}

.interaction-count {
  font-size: 12px;
  margin-top: 4px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Información del video */
.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  z-index: 1;
}

.info-content {
  max-width: calc(100% - 80px);
}

.video-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.video-details {
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.category {
  color: #fff;
}

.duration {
  color: rgba(255, 255, 255, 0.8);
}

.date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Comentarios */
.comments-dialog {
  width: 100%;
  height: 100%;
  background: white;
}

.comment {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 12px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-info {
  flex: 1;
}

.username {
  font-weight: 600;
  color: #2c3e50;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.comment-content {
  padding-left: 44px;
  color: #2c3e50;
}

.comment-input {
  padding: 12px;
  background: white;
  position: sticky;
  bottom: 0;
  border-top: 1px solid #eee;
}

/* Compartir */
.share-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.share-btn {
  width: 100%;
  justify-content: flex-start;
  padding: 8px 16px;
  text-transform: none;
}

@media (min-width: 768px) {
  .video-player {
    width: auto;
    height: 100%;
    max-width: 100%;
  }

  .comments-dialog {
    width: 400px;
    height: 100vh;
  }
}
</style>
