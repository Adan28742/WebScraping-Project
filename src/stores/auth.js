// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "../config/firebase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = computed(() => user.value !== null);

  // Login con Firebase
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        username: userCredential.user.displayName || email.split("@")[0],
        avatar:
          userCredential.user.photoURL ||
          "https://cdn.quasar.dev/img/boy-avatar.png",
      };
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Registro con Firebase
  const register = async ({ nombres, apellidos, email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const displayName = `${nombres} ${apellidos}`;

      await updateProfile(userCredential.user, {
        displayName,
        photoURL: "https://cdn.quasar.dev/img/boy-avatar.png",
      });

      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        username: displayName,
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
      };

      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error en registro:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Logout con Firebase
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      user.value = null;
      localStorage.removeItem("user");
      localStorage.removeItem("rememberedEmail");
    } catch (error) {
      console.error("Error en logout:", error);
      throw error;
    }
  };

  // Manejo de errores de Firebase
  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Este correo electrónico ya está registrado";
      case "auth/invalid-email":
        return "Correo electrónico inválido";
      case "auth/operation-not-allowed":
        return "Operación no permitida";
      case "auth/weak-password":
        return "La contraseña es demasiado débil";
      case "auth/user-disabled":
        return "Usuario deshabilitado";
      case "auth/user-not-found":
        return "Usuario no encontrado";
      case "auth/wrong-password":
        return "Contraseña incorrecta";
      default:
        return "Error de autenticación";
    }
  };

  // Inicializar el estado de autenticación
  const initAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }

    firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          username:
            firebaseUser.displayName || firebaseUser.email.split("@")[0],
          avatar:
            firebaseUser.photoURL ||
            "https://cdn.quasar.dev/img/boy-avatar.png",
        };
        user.value = userData;
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        user.value = null;
        localStorage.removeItem("user");
      }
    });
  };

  // Inicializar la autenticación cuando se crea el store
  initAuth();

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
