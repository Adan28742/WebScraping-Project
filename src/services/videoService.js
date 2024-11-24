// src/services/videoService.js
import axios from "axios";

const BASE_URL = "your_api_url_here"; // Replace with your actual API URL

export const videoService = {
  async getVideos() {
    try {
      const response = await axios.get(`${BASE_URL}/videos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Return mock data for development
      return [
        {
          idVideoGenerado: 1,
          idCategoria: 1,
          fechaCreacion: "2024-11-05T22:23:51.693",
          linkVideo:
            "https://drive.google.com/file/d/1GEd0buzM3R4VyBuVly3Ayh1Rl8YfEMki/view",
          estado: true,
          duracion: 10,
        },
        {
          idVideoGenerado: 2,
          idCategoria: 2,
          fechaCreacion: "2024-11-05T22:24:51.693",
          linkVideo:
            "https://drive.google.com/file/d/1p0FwI2QgInjEty5T3pRNi5N7MCVdu-eL/view",
          estado: true,
          duracion: 15,
        },
      ];
    }
  },

  async likeVideo(videoId) {
    try {
      await axios.post(`${BASE_URL}/videos/${videoId}/like`);
      return true;
    } catch (error) {
      console.error("Error liking video:", error);
      return false;
    }
  },

  async saveVideo(videoId) {
    try {
      await axios.post(`${BASE_URL}/videos/${videoId}/save`);
      return true;
    } catch (error) {
      console.error("Error saving video:", error);
      return false;
    }
  },
};
