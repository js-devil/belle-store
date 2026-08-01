<template>
  <div class="header-wrap classicHeader animated d-flex">
    <div class="container-fluid">
      <div class="row align-items-center">
        <!--Desktop Logo-->
        <div class="logo col-md-2 col-lg-2 d-none d-lg-block">
          <NuxtLink to="/">
            <img
              src="/images/logo.svg"
              alt="Belle Store"
              title="Belle Store"
            />
          </NuxtLink>
        </div>
        <!--End Desktop Logo-->
        <div class="col-2 col-sm-3 col-md-3 col-lg-8">
          <div class="d-block d-lg-none">
            <button
              type="button"
              class="btn--link site-header__menu js-mobile-nav-toggle mobile-nav--open"
            >
              <i class="icon anm anm-times-l"></i>
              <i class="anm anm-bars-r"></i>
            </button>
          </div>
          <!--Desktop Menu-->
          <nav class="grid__item" id="AccessibleNav">
            <!-- for mobile -->
            <ul id="siteNav" class="site-nav medium center hidearrow">
              <li class="lvl1">
                <NuxtLink to="/">Home</NuxtLink>
              </li>
              <li class="lvl1 parent dropdown">
                <a href="#">Shop <i class="anm anm-angle-down-l"></i></a>
                <ul class="dropdown">
                  <li><NuxtLink to="/shop" class="site-nav">All Products</NuxtLink></li>
                  <li><NuxtLink to="/collection" class="site-nav">Collection</NuxtLink></li>
                  <li v-for="category in categories" :key="category.slug">
                    <NuxtLink :to="`/shop?category=${category.slug}`" class="site-nav">{{
                      category.label
                    }}</NuxtLink>
                  </li>
                </ul>
              </li>
              <li class="lvl1 parent dropdown">
                <a href="#">Pages <i class="anm anm-angle-down-l"></i></a>
                <ul class="dropdown">
                  <li><NuxtLink to="/cart" class="site-nav">Cart</NuxtLink></li>
                  <li><NuxtLink to="/wishlist" class="site-nav">Wishlist</NuxtLink></li>
                  <li><NuxtLink to="/about-us" class="site-nav">About Us</NuxtLink></li>
                  <li><NuxtLink to="/faq" class="site-nav">FAQs</NuxtLink></li>
                </ul>
              </li>
            </ul>
          </nav>
          <!--End Desktop Menu-->
        </div>
        <!--Mobile Logo-->
        <div
          class="col-6 col-sm-6 col-md-6 col-lg-2 d-block d-lg-none mobile-logo"
        >
          <div class="logo">
            <NuxtLink to="/">
              <img src="/images/logo.svg" alt="Belle Store" title="Belle Store" />
            </NuxtLink>
          </div>
        </div>
        <!--Mobile Logo-->
        <div class="col-4 col-sm-3 col-md-3 col-lg-2">
          <div class="site-cart">
            <NuxtLink to="/cart" class="site-header__cart" title="Cart">
              <i class="icon anm anm-bag-l"></i>
              <span
                id="CartCount"
                class="site-header__cart-count"
                data-cart-render="item_count"
                >{{ itemCount }}</span
              >
            </NuxtLink>
            <!--Minicart Popup-->
            <div id="header-cart" class="block block-cart">
              <div v-if="items.length === 0" class="mini-cart-empty text-center">
                <i class="icon anm anm-bag-l"></i>
                <p>Your cart is empty.</p>
                <NuxtLink to="/shop" class="btn btn-secondary btn--small">Browse Products</NuxtLink>
              </div>
              <ul v-else class="mini-products-list">
                <li v-for="item in items" :key="item.key" class="item">
                  <a class="product-image" href="#">
                    <img :src="item.image" :alt="item.name" title="" />
                  </a>
                  <div class="product-details">
                    <a href="#" class="remove" @click.prevent="removeFromCart(item.key)"
                      ><i class="anm anm-times-l" aria-hidden="true"></i
                    ></a>
                    <NuxtLink class="pName" :to="`/product/${item.slug}`">{{
                      item.name
                    }}</NuxtLink>
                    <div v-if="item.size || item.color" class="variant-cart">
                      {{ [item.color, item.size].filter(Boolean).join(" / ") }}
                    </div>
                    <div class="priceRow">
                      <div class="product-price">
                        Qty: {{ item.qty }} &middot;
                        <span class="money">{{
                          formatPrice(item.unitPriceUsd * item.qty)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="items.length" class="total">
                <div class="total-in">
                  <span class="label">Cart Subtotal:</span
                  ><span class="product-price"
                    ><span class="money">{{ formatPrice(subtotalUsd) }}</span></span
                  >
                </div>
                <div class="buttonSet text-center">
                  <NuxtLink to="/cart" class="btn btn-secondary btn--small"
                    >View Cart</NuxtLink
                  >
                  <NuxtLink to="/checkout" class="btn btn-secondary btn--small"
                    >Checkout</NuxtLink
                  >
                </div>
              </div>
            </div>
            <!--End Minicart Popup-->
          </div>
          <div class="site-header__search">
            <button type="button" class="search-trigger">
              <i class="icon anm anm-search-l"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { categories } from "@/data/categories.js";

const { items, itemCount, subtotalUsd, removeFromCart } = useCart();
const { formatPrice } = useCurrency();
</script>

<style scoped>
.mini-cart-empty {
  padding: 24px 16px;
}
.mini-cart-empty .icon {
  font-size: 32px;
  color: #c3c2b7;
  display: block;
  margin-bottom: 10px;
}
.mini-cart-empty p {
  color: #767676;
  margin-bottom: 14px;
}
</style>
