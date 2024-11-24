<!-- src/components/ActionConfirmation.vue -->
<template>
  <transition name="slide-up">
    <div v-if="show" class="action-confirmation" :class="type">
      <div class="confirmation-content">
        <q-icon :name="icon" size="24px" />
        <span class="confirmation-text">{{ message }}</span>
      </div>
      <div class="action-buttons" v-if="showAction">
        <q-btn
          flat
          dense
          :color="actionColor"
          :label="actionLabel"
          @click="handleAction"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    default: "success",
    validator: (value) => ["success", "error", "info"].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
  actionLabel: {
    type: String,
    default: "",
  },
  showAction: {
    type: Boolean,
    default: false,
  },
});

const icon = computed(() => {
  switch (props.type) {
    case "success":
      return "check_circle";
    case "error":
      return "error";
    case "info":
      return "info";
    default:
      return "info";
  }
});

const actionColor = computed(() => {
  switch (props.type) {
    case "success":
      return "positive";
    case "error":
      return "negative";
    case "info":
      return "primary";
    default:
      return "primary";
  }
});

const emit = defineEmits(["action"]);

const handleAction = () => {
  emit("action");
};
</script>

<style scoped>
.action-confirmation {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 300px;
  max-width: 90vw;
}

.confirmation-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-confirmation.success {
  background: #4caf50;
  color: white;
}

.action-confirmation.error {
  background: #f44336;
  color: white;
}

.action-confirmation.info {
  background: #2196f3;
  color: white;
}

.confirmation-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.action-buttons {
  margin-left: 16px;
}

/* Animaciones */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translate(-50%, 100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style>
