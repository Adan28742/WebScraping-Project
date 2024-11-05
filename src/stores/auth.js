// src/stores/auth.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const storedUser = localStorage.getItem("user");
  const user = ref(storedUser ? JSON.parse(storedUser) : null);
  const users = ref(JSON.parse(localStorage.getItem("users") || "[]"));

  function register({ nombres, apellidos, email, password }) {
    // Verificar si el email ya existe
    if (users.value.find((u) => u.email === email)) {
      return Promise.reject(
        new Error("Este correo electrónico ya está registrado")
      );
    }

    // Crear nuevo usuario
    const newUser = {
      id: users.value.length + 1,
      nombres,
      apellidos,
      email,
      password, // En una app real, esto debería estar hasheado
      createdAt: new Date().toISOString(),
    };

    users.value.push(newUser);
    localStorage.setItem("users", JSON.stringify(users.value));
    return Promise.resolve(newUser);
  }

  function login(email, password) {
    const foundUser = users.value.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        nombres: foundUser.nombres,
        apellidos: foundUser.apellidos,
      };
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return Promise.resolve(userData);
    }

    // Mantener usuario de prueba (opcional, puedes removerlo en producción)
    if (email === "admin@admin.com" && password === "admin") {
      const userData = {
        id: 0,
        email: "admin@admin.com",
        nombres: "Admin",
        apellidos: "Usuario",
      };
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return Promise.resolve(userData);
    }

    return Promise.reject(new Error("Credenciales incorrectas"));
  }

  function logout() {
    user.value = null;
    localStorage.removeItem("user");
  }

  function getUserProfile() {
    return user.value;
  }

  function updateUserProfile(userData) {
    if (!user.value)
      return Promise.reject(new Error("No hay usuario logueado"));

    const userIndex = users.value.findIndex((u) => u.id === user.value.id);
    if (userIndex === -1)
      return Promise.reject(new Error("Usuario no encontrado"));

    // Actualizar datos
    const updatedUser = {
      ...users.value[userIndex],
      ...userData,
      password: users.value[userIndex].password, // Mantener la contraseña original
    };

    users.value[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users.value));

    // Actualizar usuario actual
    user.value = {
      id: updatedUser.id,
      email: updatedUser.email,
      nombres: updatedUser.nombres,
      apellidos: updatedUser.apellidos,
    };
    localStorage.setItem("user", JSON.stringify(user.value));

    return Promise.resolve(user.value);
  }

  return {
    user,
    login,
    logout,
    register,
    getUserProfile,
    updateUserProfile,
  };
});
