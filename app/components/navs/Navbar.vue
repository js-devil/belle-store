<template>
  <div class="top-header">
    <div class="container-fluid">
      <div class="row">
        <div class="col-10 col-sm-8 col-md-5 col-lg-4">
          <div class="currency-picker" ref="pickerEl">
            <span class="selected-currency country-option" @click="isOpen = !isOpen">
              <span class="country-flag">{{ COUNTRIES[country].flag }}</span>
              <span class="country-name"
                >{{ COUNTRIES[country].label }} ({{ COUNTRIES[country].currency }})</span
              >
            </span>
            <ul id="currencies" :style="{ display: isOpen ? 'block' : 'none' }">
              <li
                v-for="code in Object.keys(COUNTRIES)"
                :key="code"
                class="country-option"
                :class="{ selected: country === code }"
                @click="selectCountry(code)"
              >
                <span class="country-flag">{{ COUNTRIES[code].flag }}</span>
                <span class="country-name"
                  >{{ COUNTRIES[code].label }} ({{ COUNTRIES[code].currency }})</span
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="col-sm-4 col-md-4 col-lg-4 d-none d-lg-none d-md-block d-lg-block"
        >
          <div class="text-center">
            <p class="top-header_middle-text">
              Nationwide Delivery Across Nigeria
            </p>
          </div>
        </div>
        <div class="col-2 col-sm-4 col-md-3 col-lg-4 text-right">
          <span class="user-menu d-block d-lg-none"
            ><i class="anm anm-user-al" aria-hidden="true"></i
          ></span>
          <ul class="customer-links list-inline">
            <li><NuxtLink to="/wishlist">Wishlist</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { COUNTRIES } from "@/composables/useCurrency.js";

const { country, setCountry } = useCurrency();

const isOpen = ref(false);
const pickerEl = ref(null);

function selectCountry(code) {
  setCountry(code);
  isOpen.value = false;
}

function handleClickOutside(event) {
  if (pickerEl.value && !pickerEl.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>

<style scoped>
.country-option {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.selected-currency.country-option {
  width: auto;
}
.country-flag {
  font-size: 14px;
  line-height: 1;
}
#currencies {
  width: max-content;
}
</style>
