// src/services/googleDriveService.js

const FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

export const googleDriveService = {
  async getVideosFromFolder() {
    try {
      console.log("Using API Key:", API_KEY ? "Yes" : "No");
      console.log("Using Folder ID:", FOLDER_ID);

      if (!API_KEY) {
        throw new Error("API Key no configurada");
      }

      // Construir la URL de la API
      const apiUrl = new URL("https://www.googleapis.com/drive/v3/files");
      apiUrl.searchParams.append(
        "q",
        `'${FOLDER_ID}' in parents and mimeType contains 'video/'`
      );
      apiUrl.searchParams.append("key", API_KEY);
      apiUrl.searchParams.append(
        "fields",
        "files(id,name,createdTime,mimeType,videoMediaMetadata)"
      );
      apiUrl.searchParams.append("orderBy", "createdTime desc");

      console.log("Requesting URL:", apiUrl.toString());

      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Drive API Error Response:", errorData);
        throw new Error(
          `Error de API: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Drive API Response:", data);

      if (!data.files || data.files.length === 0) {
        console.log("No se encontraron videos en la carpeta");
        return [];
      }

      return data.files.map((file) => ({
        idVideoGenerado: file.id,
        fechaCreacion: file.createdTime,
        linkVideo: `https://drive.google.com/file/d/${file.id}/view`,
        embedUrl: `https://drive.google.com/file/d/${file.id}/preview`,
        estado: true,
        duracion: file.videoMediaMetadata?.durationMillis
          ? Math.floor(file.videoMediaMetadata.durationMillis / 1000)
          : 0,
        idCategoria: 1,
        title: file.name,
      }));
    } catch (error) {
      console.error("Error completo al obtener videos:", error);
      throw error;
    }
  },

  getEmbedUrl(url) {
    try {
      const videoId = url.match(/[-\w]{25,}/)?.[0];
      console.log("Extracted video ID:", videoId, "from URL:", url);
      return videoId
        ? `https://drive.google.com/file/d/${videoId}/preview`
        : null;
    } catch (error) {
      console.error("Error getting embed URL:", error);
      return null;
    }
  },
};
