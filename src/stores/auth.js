// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
          "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
        createdAt: userCredential.user.metadata.creationTime,
      };
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) throw new Error("No hay usuario autenticado");

      // Actualizar perfil en Firebase
      await updateFirebaseProfile(currentUser, {
        displayName: profileData.username,
        photoURL: profileData.avatar,
      });

      // Actualizar estado local
      const updatedUserData = {
        ...user.value,
        username: profileData.username,
        avatar: profileData.avatar,
        email: profileData.email,
      };

      user.value = updatedUserData;
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      return updatedUserData;
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      throw new Error("Error al actualizar el perfil");
    }
  };

  // Actualizar contraseña
  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) throw new Error("No hay usuario autenticado");

      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Actualizar contraseña
      await firebaseUpdatePassword(currentUser, newPassword);
    } catch (error) {
      console.error("Error actualizando contraseña:", error);
      if (error.code === "auth/wrong-password") {
        throw new Error("La contraseña actual es incorrecta");
      }
      throw new Error("Error al actualizar la contraseña");
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

      await updateFirebaseProfile(userCredential.user, {
        displayName,
        photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
      });

      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        username: displayName,
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
        createdAt: userCredential.user.metadata.creationTime,
      };

      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error en registro:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Logout
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
            "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
          createdAt: firebaseUser.metadata.creationTime,
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
    updateProfile,
    updateUserPassword,
  };
});
