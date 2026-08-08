// Small global toast queue - a single useState array rendered once by
// ToastContainer.vue (mounted in app.vue), so any composable/component can
// call showToast() without needing its own UI.
export function useToast() {
  const toasts = useState("toasts", () => []);

  function showToast(message, duration = 2200) {
    if (typeof window === "undefined") return;
    const id = `${Date.now()}-${Math.random()}`;
    toasts.value.push({ id, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }, duration);
  }

  return { toasts, showToast };
}
