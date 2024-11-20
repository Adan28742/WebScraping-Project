<!-- src/pages/PerfilPage.vue -->
<template>
  <div class="profile-container">
    <q-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <q-avatar size="150px">
            <img :src="userProfile.avatar" alt="Avatar" />
          </q-avatar>
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            class="avatar-edit"
            @click="openAvatarDialog"
          />
        </div>
        <div class="user-info">
          <h2>{{ userProfile.username }}</h2>
          <p class="email">{{ userProfile.email }}</p>
        </div>
      </div>

      <q-separator />

      <q-card-section>
        <q-form @submit="onSubmit" class="profile-form">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.username"
                label="Nombre de usuario"
                outlined
                :rules="[(val) => !!val || 'El nombre de usuario es requerido']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.email"
                label="Correo electrónico"
                outlined
                type="email"
                :rules="[
                  (val) => !!val || 'El correo electrónico es requerido',
                  (val) => isValidEmail(val) || 'Correo electrónico inválido',
                ]"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12">
              <q-input
                v-model="form.currentPassword"
                label="Contraseña actual"
                outlined
                type="password"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.newPassword"
                label="Nueva contraseña"
                outlined
                type="password"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.confirmPassword"
                label="Confirmar nueva contraseña"
                outlined
                type="password"
                :rules="[
                  (val) =>
                    !form.newPassword ||
                    val === form.newPassword ||
                    'Las contraseñas no coinciden',
                ]"
              />
            </div>
          </div>

          <div class="row q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              label="Guardar cambios"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Avatar Dialog -->
    <q-dialog v-model="avatarDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Cambiar avatar</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div v-for="avatar in avatarOptions" :key="avatar" class="col-4">
              <q-img
                :src="avatar"
                :ratio="1"
                class="cursor-pointer avatar-option"
                :class="{ selected: userProfile.avatar === avatar }"
                @click="selectAvatar(avatar)"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveAvatar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useVideoStore } from "stores/video";

const $q = useQuasar();
const videoStore = useVideoStore();

const userProfile = ref({
  username: "",
  email: "",
  avatar: "",
});

const form = ref({
  username: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const loading = ref(false);
const avatarDialog = ref(false);
const selectedAvatar = ref("");

const avatarOptions = [
  "https://cdn.quasar.dev/img/boy-avatar.png",
  "https://cdn.quasar.dev/img/avatar1.jpg",
  "https://cdn.quasar.dev/img/avatar2.jpg",
  "https://cdn.quasar.dev/img/avatar3.jpg",
  "https://cdn.quasar.dev/img/avatar4.jpg",
  "https://cdn.quasar.dev/img/avatar5.jpg",
];

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const openAvatarDialog = () => {
  selectedAvatar.value = userProfile.value.avatar;
  avatarDialog.value = true;
};

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar;
};

const saveAvatar = () => {
  videoStore.updateUserProfile({ avatar: selectedAvatar.value });
  userProfile.value.avatar = selectedAvatar.value;
  avatarDialog.value = false;
  $q.notify({
    message: "Avatar actualizado con éxito",
    color: "positive",
  });
};

const onSubmit = async () => {
  loading.value = true;
  try {
    // Aquí iría la lógica para actualizar el perfil
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación
    videoStore.updateUserProfile({
      username: form.value.username,
      email: form.value.email,
    });
    $q.notify({
      message: "Perfil actualizado con éxito",
      color: "positive",
    });
  } catch (error) {
    $q.notify({
      message: "Error al actualizar el perfil",
      color: "negative",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    userProfile.value = {
      ...userData,
      avatar: videoStore.userProfile.avatar,
    };
    form.value.username = userData.username;
    form.value.email = userData.email || "";
  }
});
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  border-radius: 12px;
}

.profile-header {
  padding: 30px;
  text-align: center;
}

.avatar-section {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-info h2 {
  margin: 0;
  color: #2c3e50;
}

.email {
  color: #666;
  margin: 5px 0 0;
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.avatar-option {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.selected {
  border: 3px solid #0396ff;
}
</style>
