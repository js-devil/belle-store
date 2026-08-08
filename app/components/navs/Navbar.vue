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
            <li v-if="isLoggedIn" class="wallet-badge" :title="`Logged in as ${account.name}`">
              <i class="anm anm-money-bill-alt" aria-hidden="true"></i>
              {{ formatPrice(account.walletUsd) }}
            </li>
            <li v-if="isLoggedIn"><a href="#" @click.prevent="logout">Log out</a></li>
            <li v-else><a href="#" @click.prevent="showModal = true">Sign In</a></li>
            <li><NuxtLink to="/wishlist">Wishlist</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>

    <AccountModal v-if="showModal" @close="showModal = false" @authenticated="showModal = false" />
  </div>
</template>

<script setup>
import { COUNTRIES } from "@/composables/useCurrency.js";

const { country, setCountry, formatPrice } = useCurrency();
const { account, isLoggedIn, logout } = useAccount();

const isOpen = ref(false);
const pickerEl = ref(null);
const showModal = ref(false);

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
.top-header > .container-fluid {
  padding: 0 20px;
}
@media (max-width: 767px) {
  .top-header > .container-fluid {
    padding: 0 12px;
  }
}
.wallet-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: #2e7d32;
}
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
