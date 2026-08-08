<template>
  <Teleport to="body">
    <div class="account-modal-overlay" @click.self="$emit('close')">
      <div class="account-modal">
        <button type="button" class="account-modal__close" aria-label="Close" @click="$emit('close')">
          <i class="anm anm-times-l"></i>
        </button>

        <div class="account-modal__tabs">
          <button
            type="button"
            :class="{ active: mode === 'signup' }"
            @click="mode = 'signup'"
          >
            Create account
          </button>
          <button type="button" :class="{ active: mode === 'login' }" @click="mode = 'login'">
            Log in
          </button>
        </div>

        <p class="account-modal__hint">
          {{
            mode === "signup"
              ? "Quick and free - this gives you a wallet balance to shop with."
              : "Log in with the username and phone number you signed up with."
          }}
        </p>

        <form class="account-modal__form" @submit.prevent="handleSubmit">
          <label v-if="mode === 'signup'">
            Full name
            <input v-model="name" type="text" required autocomplete="name" />
          </label>
          <label>
            Username
            <input v-model="username" type="text" required autocomplete="username" />
          </label>
          <label>
            Phone number
            <input v-model="phone" type="tel" required autocomplete="tel" placeholder="e.g. 08012345678" />
          </label>

          <p v-if="errorMessage" class="account-modal__error">{{ errorMessage }}</p>

          <button type="submit" class="btn" :disabled="submitting">
            {{ submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Log in" }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const emit = defineEmits(["close", "authenticated"]);
const { signup, login } = useAccount();

const mode = ref("signup");
const name = ref("");
const username = ref("");
const phone = ref("");
const submitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";
  try {
    if (mode.value === "signup") {
      await signup({ name: name.value, username: username.value, phone: phone.value });
    } else {
      await login({ username: username.value, phone: phone.value });
    }
    emit("authenticated");
  } catch (error) {
    errorMessage.value = error?.data?.statusMessage || error?.statusMessage || "Something went wrong.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.account-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}
.account-modal {
  position: relative;
  background: #fff;
  border-radius: 6px;
  width: 100%;
  max-width: 380px;
  padding: 28px 24px 24px;
}
.account-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}
.account-modal__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
  border-bottom: 1px solid #eee;
}
.account-modal__tabs button {
  flex: 1;
  background: none;
  border: none;
  padding: 10px 4px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #999;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.account-modal__tabs button.active {
  color: #111;
  border-bottom-color: #111;
}
.account-modal__hint {
  font-size: 13px;
  color: #767676;
  margin-bottom: 16px;
}
.account-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.account-modal__form label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #444;
}
.account-modal__form input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
}
.account-modal__form .btn {
  margin-top: 6px;
  width: 100%;
}
.account-modal__error {
  color: #c0392b;
  font-size: 13px;
  margin: 0;
}
</style>
