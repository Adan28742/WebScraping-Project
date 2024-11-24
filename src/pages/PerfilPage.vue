<!-- src/pages/PerfilPage.vue -->
<template>
  <div class="profile-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <q-spinner color="primary" size="3em" />
      <p>Cargando perfil...</p>
    </div>

    <q-card v-else class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <q-avatar size="150px" class="avatar">
            <img :src="form.avatar" alt="Avatar" />
            <div class="avatar-overlay" @click="openAvatarDialog">
              <q-icon name="edit" size="24px" />
              <span>Cambiar avatar</span>
            </div>
          </q-avatar>
        </div>
        <div class="user-info">
          <h2>{{ form.username }}</h2>
          <p class="email">{{ form.email }}</p>
          <p class="member-since">Miembro desde {{ memberSince }}</p>
        </div>
      </div>

      <q-separator />

      <q-card-section>
        <q-form @submit="onSubmit" class="profile-form">
          <div class="row q-col-gutter-md">
            <!-- Nombre de usuario -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.username"
                label="Nombre de usuario"
                :rules="[
                  (val) => !!val || 'El nombre de usuario es requerido',
                  (val) => val.length >= 3 || 'Mínimo 3 caracteres',
                ]"
                outlined
                dense
                :disable="saving"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <!-- Email -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                :rules="[
                  (val) => !!val || 'El correo electrónico es requerido',
                  (val) => isValidEmail(val) || 'Correo electrónico inválido',
                ]"
                outlined
                dense
                :disable="saving"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Sección de contraseña -->
          <div class="password-section q-mt-md">
            <q-expansion-item
              icon="lock"
              label="Cambiar contraseña"
              header-class="text-primary"
            >
              <div class="row q-col-gutter-md q-mt-sm">
                <div class="col-12">
                  <q-input
                    v-model="form.currentPassword"
                    label="Contraseña actual"
                    type="password"
                    outlined
                    dense
                    :disable="saving"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.newPassword"
                    label="Nueva contraseña"
                    type="password"
                    outlined
                    dense
                    :disable="saving"
                    :rules="[
                      (val) => !val || val.length >= 6 || 'Mínimo 6 caracteres',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_open" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.confirmPassword"
                    label="Confirmar nueva contraseña"
                    type="password"
                    outlined
                    dense
                    :disable="saving"
                    :rules="[
                      (val) =>
                        !form.newPassword ||
                        val === form.newPassword ||
                        'Las contraseñas no coinciden',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_clock" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-expansion-item>
          </div>

          <!-- Preferencias -->
          <div class="preferences-section q-mt-lg">
            <h6 class="text-h6 q-mb-md">Preferencias</h6>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-list bordered separator>
                  <q-item tag="label" v-ripple>
                    <q-item-section>
                      <q-item-label>Modo oscuro</q-item-label>
                      <q-item-label caption>
                        Cambiar entre tema claro y oscuro
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        v-model="form.preferences.darkMode"
                        color="primary"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item tag="label" v-ripple>
                    <q-item-section>
                      <q-item-label>Reproducción automática</q-item-label>
                      <q-item-label caption>
                        Reproducir videos automáticamente
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        v-model="form.preferences.autoplay"
                        color="primary"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-6">
                <q-list bordered separator>
                  <q-item tag="label" v-ripple>
                    <q-item-section>
                      <q-item-label>Notificaciones</q-item-label>
                      <q-item-label caption>
                        Recibir notificaciones de actividad
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        v-model="form.preferences.notifications"
                        color="primary"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item tag="label" v-ripple>
                    <q-item-section>
                      <q-item-label>Perfil público</q-item-label>
                      <q-item-label caption>
                        Permitir que otros vean tu perfil
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        v-model="form.preferences.publicProfile"
                        color="primary"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="row justify-end q-mt-lg q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="grey"
              flat
              :disable="saving"
              @click="resetForm"
            />
            <q-btn
              type="submit"
              label="Guardar cambios"
              color="primary"
              :loading="saving"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Diálogo de selección de avatar -->
    <q-dialog v-model="avatarDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Cambiar avatar</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm">
            <div
              v-for="avatar in avatarOptions"
              :key="avatar"
              class="col-4 col-sm-3"
            >
              <q-img
                :src="avatar"
                :ratio="1"
                class="cursor-pointer avatar-option"
                :class="{ selected: form.avatar === avatar }"
                @click="selectAvatar(avatar)"
              >
                <div
                  class="absolute-bottom text-center"
                  v-if="form.avatar === avatar"
                >
                  <q-icon name="check_circle" color="primary" size="24px" />
                </div>
              </q-img>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Seleccionar" color="primary" @click="saveAvatar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { useUserStore } from "src/stores/user";

const $q = useQuasar();
const authStore = useAuthStore();
const userStore = useUserStore();

const loading = ref(true);
const saving = ref(false);
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

const form = ref({
  username: "",
  email: "",
  avatar: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  preferences: {
    darkMode: false,
    autoplay: true,
    notifications: true,
    publicProfile: true,
  },
});

const originalForm = ref(null);

const memberSince = computed(() => {
  const date = new Date(authStore.user?.createdAt || Date.now());
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const loadUserData = () => {
  const user = authStore.user;
  const preferences = userStore.preferences;

  form.value = {
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || avatarOptions[0],
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    preferences: {
      darkMode: preferences?.darkMode || false,
      autoplay: preferences?.autoplay || true,
      notifications: preferences?.notifications || true,
      publicProfile: preferences?.publicProfile || true,
    },
  };

  originalForm.value = JSON.parse(JSON.stringify(form.value));
  loading.value = false;
};

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(originalForm.value));
  $q.notify({
    message: "Cambios descartados",
    color: "warning",
    position: "top",
  });
};

const openAvatarDialog = () => {
  selectedAvatar.value = form.value.avatar;
  avatarDialog.value = true;
};

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar;
};

const saveAvatar = () => {
  form.value.avatar = selectedAvatar.value;
  avatarDialog.value = false;
};

const validateForm = () => {
  if (!form.value.username || form.value.username.length < 3) {
    $q.notify({
      message: "El nombre de usuario debe tener al menos 3 caracteres",
      color: "negative",
      position: "top",
    });
    return false;
  }

  if (!isValidEmail(form.value.email)) {
    $q.notify({
      message: "Por favor ingrese un correo electrónico válido",
      color: "negative",
      position: "top",
    });
    return false;
  }

  if (form.value.newPassword && form.value.newPassword.length < 6) {
    $q.notify({
      message: "La nueva contraseña debe tener al menos 6 caracteres",
      color: "negative",
      position: "top",
    });
    return false;
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    $q.notify({
      message: "Las contraseñas no coinciden",
      color: "negative",
      position: "top",
    });
    return false;
  }

  return true;
};

const onSubmit = async () => {
  if (!validateForm()) return;

  saving.value = true;
  try {
    // Actualizar perfil en el store de autenticación
    await authStore.updateProfile({
      username: form.value.username,
      email: form.value.email,
      avatar: form.value.avatar,
    });

    // Actualizar preferencias en el store de usuario
    userStore.updatePreferences(form.value.preferences);

    // Si hay nueva contraseña, actualizarla
    if (form.value.newPassword) {
      await authStore.updatePassword(
        form.value.currentPassword,
        form.value.newPassword
      );
    }

    // Actualizar el formulario original con los nuevos valores
    originalForm.value = JSON.parse(JSON.stringify(form.value));

    $q.notify({
      message: "Perfil actualizado exitosamente",
      color: "positive",
      position: "top",
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    $q.notify({
      message: error.message || "Error al actualizar el perfil",
      color: "negative",
      position: "top",
    });
  } finally {
    saving.value = false;
    // Limpiar campos de contraseña
    form.value.currentPassword = "";
    form.value.newPassword = "";
    form.value.confirmPassword = "";
  }
};

onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.profile-container {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-card {
  border-radius: 12px;
  overflow: hidden;
}

.loading-state {
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.profile-header {
  padding: 32px;
  text-align: center;
  background: linear-gradient(135deg, #0396ff0d 0%, #0d47a10d 100%);
}

.avatar-section {
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
}

.avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay span {
  font-size: 0.8rem;
  margin-top: 4px;
}

.user-info h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.email {
  color: #666;
  margin: 4px 0;
}

.member-since {
  color: #888;
  font-size: 0.9rem;
  margin: 4px 0 0;
}

.profile-form {
  padding: 16px 0;
}

.password-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.preferences-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
}

.avatar-option {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: #0396ff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }

  .profile-header {
    padding: 24px 16px;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .user-info h2 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 8px;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .preferences-section .col-12 {
    padding: 4px;
  }
}
</style>
