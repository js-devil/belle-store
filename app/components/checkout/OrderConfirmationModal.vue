<template>
  <Teleport to="body">
    <div class="order-modal-overlay" @click.self="$emit('close')">
      <div class="order-modal">
        <button type="button" class="order-modal__close" aria-label="Close" @click="$emit('close')">
          <i class="anm anm-times-l"></i>
        </button>

        <i class="anm anm-check-circle order-modal__icon"></i>
        <h3>Thank you for your order!</h3>
        <p class="order-modal__message">
          Your products will be delivered nationwide across Nigeria. You'll be able to track
          everything from your account once delivery begins.
        </p>

        <div class="order-modal__survey">
          <p>
            This store is a research prototype for a study on 3D product visualization. If you
            have a moment, sharing your experience really helps the research:
          </p>
          <a
            :href="SURVEY_URL"
            target="_blank"
            rel="noopener"
            class="btn order-modal__survey-btn"
          >
            Take the post-study survey
          </a>
        </div>

        <button type="button" class="order-modal__continue" @click="$emit('close')">
          Continue shopping
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineEmits(["close"]);

const SURVEY_URL = "https://forms.gle/M59u8ZYNDonX4b3HA";
</script>

<style scoped>
.order-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}
.order-modal {
  position: relative;
  background: #fff;
  border-radius: 6px;
  width: 100%;
  max-width: 420px;
  padding: 32px 26px 26px;
  text-align: center;
}
.order-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}
.order-modal__icon {
  font-size: 40px;
  color: #2e7d32;
  margin-bottom: 12px;
  display: block;
}
.order-modal h3 {
  margin: 0 0 10px;
  font-size: 19px;
}
.order-modal__message {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px;
}
.order-modal__survey {
  border-top: 1px solid #eee;
  padding-top: 18px;
  margin-bottom: 18px;
}
.order-modal__survey p {
  font-size: 13px;
  color: #767676;
  line-height: 1.5;
  margin: 0 0 12px;
}
.order-modal__survey-btn {
  width: 100%;
}
.order-modal__continue {
  width: 100%;
  background: none;
  border: none;
  color: #767676;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  padding: 6px 0 0;
}
</style>
