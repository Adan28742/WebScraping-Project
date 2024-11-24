// src/stores/video.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./user";
import { googleDriveService } from "../services/googleDriveService";

export const useVideoStore = defineStore("video", () => {
  const videos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const likedVideos = computed(() =>
    videos.value.filter((video) => video.liked)
  );
  const savedVideos = computed(() =>
    videos.value.filter((video) => video.saved)
  );

  // Actions
  async function fetchVideos() {
    loading.value = true;
    error.value = null;
    console.log("Iniciando fetchVideos...");

    try {
      // Obtener videos de Drive
      console.log("Llamando a googleDriveService.getVideosFromFolder()...");
      const driveVideos = await googleDriveService.getVideosFromFolder();
      console.log("Videos obtenidos de Drive:", driveVideos);

      if (!driveVideos || driveVideos.length === 0) {
        throw new Error("No se encontraron videos en la carpeta");
      }

      // Fusionar con el estado guardado
      videos.value = driveVideos.map((video) => {
        const savedState = getSavedVideoState(video.idVideoGenerado);
        return {
          ...video,
          liked: savedState?.liked || false,
          saved: savedState?.saved || false,
          comments: savedState?.comments || [],
        };
      });

      console.log("Videos procesados y guardados en el store:", videos.value);
      saveToLocalStorage();
    } catch (err) {
      console.error("Error en fetchVideos:", err);
      error.value = err.message || "Error al cargar los videos";

      // Intentar cargar desde caché si hay un error
      const cachedVideos = localStorage.getItem("driveVideos");
      if (cachedVideos) {
        console.log("Cargando videos desde caché...");
        videos.value = JSON.parse(cachedVideos);
      }
    } finally {
      loading.value = false;
    }
  }

  function getSavedVideoState(videoId) {
    const savedState = localStorage.getItem("videoState");
    if (savedState) {
      const state = JSON.parse(savedState);
      return state.find((v) => v.id === videoId);
    }
    return null;
  }

  function toggleLike(videoId) {
    const video = videos.value.find((v) => v.idVideoGenerado === videoId);
    if (video) {
      video.liked = !video.liked;
      saveToLocalStorage();
    }
  }

  function toggleSave(videoId) {
    const video = videos.value.find((v) => v.idVideoGenerado === videoId);
    if (video) {
      video.saved = !video.saved;
      saveToLocalStorage();
    }
  }

  function addComment(videoId, commentText) {
    const video = videos.value.find((v) => v.idVideoGenerado === videoId);
    if (video) {
      const userStore = useUserStore();
      const comment = {
        id: Date.now(),
        text: commentText,
        username: userStore.user?.username || "Usuario",
        avatar:
          userStore.preferences?.avatar ||
          "https://cdn.quasar.dev/img/boy-avatar.png",
        date: new Date().toISOString(),
      };
      if (!video.comments) video.comments = [];
      video.comments.push(comment);
      saveToLocalStorage();
    }
  }

  function saveToLocalStorage() {
    const state = videos.value.map((video) => ({
      id: video.idVideoGenerado,
      liked: video.liked,
      saved: video.saved,
      comments: video.comments || [],
    }));
    localStorage.setItem("videoState", JSON.stringify(state));
    localStorage.setItem("driveVideos", JSON.stringify(videos.value));
    localStorage.setItem("lastVideoFetch", Date.now().toString());
  }

  // Cargar videos al inicializar el store
  fetchVideos();

  return {
    videos,
    loading,
    error,
    likedVideos,
    savedVideos,
    fetchVideos,
    toggleLike,
    toggleSave,
    addComment,
  };
});
