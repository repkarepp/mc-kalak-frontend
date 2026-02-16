import { defineStore } from "pinia";
import { ref } from "vue";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface Modal {
  isOpen: boolean;
  type: string | null;
  data: any;
}

export const useUIStore = defineStore("ui", () => {
  // State
  const notifications = ref<Notification[]>([]);
  const modal = ref<Modal>({
    isOpen: false,
    type: null,
    data: null,
  });
  const sidebar = ref({
    isOpen: true,
  });
  const theme = ref<"light" | "dark">("light");

  // Actions
  function showNotification(options: {
    type: NotificationType;
    message: string;
    duration?: number;
  }) {
    const id = Date.now();
    const duration = options.duration ?? 5000;

    notifications.value.push({
      id,
      type: options.type,
      message: options.message,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }

  function removeNotification(id: number) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

  function openModal(type: string, data: any = null) {
    modal.value = { isOpen: true, type, data };
  }

  function closeModal() {
    modal.value = { isOpen: false, type: null, data: null };
  }

  function toggleSidebar() {
    sidebar.value.isOpen = !sidebar.value.isOpen;
  }

  function setTheme(newTheme: "light" | "dark") {
    theme.value = newTheme;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }

  return {
    // State
    notifications,
    modal,
    sidebar,
    theme,
    // Actions
    showNotification,
    removeNotification,
    openModal,
    closeModal,
    toggleSidebar,
    setTheme,
    initTheme,
  };
});
