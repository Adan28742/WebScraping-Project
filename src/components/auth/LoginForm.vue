<!-- src/components/auth/LoginForm.vue -->
<template>
  <q-card class="login-card">
    <q-card-section class="text-center">
      <h5 class="text-h5 q-mt-none q-mb-md">Login</h5>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <q-input
          v-model="username"
          label="Username"
          :rules="[(val) => !!val || 'Username is required']"
          filled
          square
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          label="Password"
          :type="isPwd ? 'password' : 'text'"
          :rules="[(val) => !!val || 'Password is required']"
          filled
          square
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="full-width q-mt-md">
          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="full-width"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>

        <div class="text-center q-mt-sm">
          <q-btn
            flat
            color="primary"
            label="Create account"
            to="/register"
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card-section>

    <q-dialog v-model="errorDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="error" color="negative" text-color="white" />
          <span class="q-ml-sm">{{ error }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const isPwd = ref(true);
const errorDialog = ref(false);

async function handleSubmit() {
  try {
    loading.value = true;
    await auth.login(username.value, password.value);

    $q.notify({
      type: "positive",
      message: "Login successful!",
    });

    router.push("/"); // Redirige a la página principal
  } catch (e) {
    error.value = "Invalid username or password";
    errorDialog.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>
