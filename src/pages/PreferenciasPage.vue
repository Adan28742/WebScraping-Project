<!-- src/pages/PreferenciasPage.vue -->
<template>
  <div class="preferences-container">
    <q-card class="preferences-card">
      <q-card-section>
        <div class="text-h6">Preferencias de visualización</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="settings-group">
          <div class="text-subtitle2 q-mb-md">Apariencia</div>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Modo oscuro</q-item-label>
              <q-item-label caption>
                Cambiar entre tema claro y oscuro
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="preferences.darkMode" color="primary" />
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Auto-reproducir videos</q-item-label>
              <q-item-label caption>
                Reproducir videos automáticamente al hacer scroll
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="preferences.autoplay" color="primary" />
            </q-item-section>
          </q-item>
        </div>

        <q-separator spaced />

        <div class="settings-group">
          <div class="text-subtitle2 q-mb-md">Notificaciones</div>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Nuevos me gusta</q-item-label>
              <q-item-label caption>
                Recibir notificaciones de nuevos me gusta
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="preferences.notifyLikes" color="primary" />
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Nuevos comentarios</q-item-label>
              <q-item-label caption>
                Recibir notificaciones de nuevos comentarios
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="preferences.notifyComments" color="primary" />
            </q-item-section>
          </q-item>
        </div>

        <q-separator spaced />

        <div class="settings-group">
          <div class="text-subtitle2 q-mb-md">Privacidad</div>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Perfil público</q-item-label>
              <q-item-label caption>
                Permitir que otros usuarios vean tu perfil
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="preferences.publicProfile" color="primary" />
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Mostrar actividad</q-item-label>
              <q-item-label caption>
                Mostrar tu actividad reciente a otros usuarios
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="preferences.showActivity" color="primary" />
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey" @click="resetPreferences" />
        <q-btn
          color="primary"
          label="Guardar cambios"
          @click="savePreferences"
          :loading="saving"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const saving = ref(false);

const preferences = ref({
  darkMode: false,
  autoplay: true,
  notifyLikes: true,
  notifyComments: true,
  publicProfile: true,
  showActivity: true,
});

const originalPreferences = { ...preferences.value };

const resetPreferences = () => {
  preferences.value = { ...originalPreferences };
};

const savePreferences = async () => {
  saving.value = true;

  try {
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Guardar en localStorage
    localStorage.setItem("userPreferences", JSON.stringify(preferences.value));

    $q.notify({
      color: "positive",
      message: "Preferencias guardadas correctamente",
      icon: "check",
    });
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Error al guardar las preferencias",
      icon: "error",
    });
  } finally {
    saving.value = false;
  }
};

// Cargar preferencias guardadas al montar el componente
const loadPreferences = () => {
  const savedPreferences = localStorage.getItem("userPreferences");
  if (savedPreferences) {
    preferences.value = {
      ...preferences.value,
      ...JSON.parse(savedPreferences),
    };
    originalPreferences.value = { ...preferences.value };
  }
};

loadPreferences();
</script>

<style scoped>
.preferences-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.preferences-card {
  border-radius: 12px;
}

.settings-group {
  padding: 16px 0;
}

.q-item {
  border-radius: 8px;
  margin: 8px 0;
}

.q-item:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
