<template>
  <footer id="footer" class="footer-4">
    <div class="newsletter-section">
      <div class="container">
        <div class="row">
          <div
            class="col-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center align-items-center"
          >
            <div class="footer-social">
              <ul class="list--inline site-footer__social-icons social-icons">
                <li>
                  <a
                    class="social-icons__link"
                    href="#"
                    target="_blank"
                    title="Belle Multipurpose Bootstrap 4 Template on Facebook"
                    ><i class="icon icon-facebook"></i
                  ></a>
                </li>
                <li>
                  <a
                    class="social-icons__link"
                    href="#"
                    target="_blank"
                    title="Belle Multipurpose Bootstrap 4 Template on Twitter"
                    ><i class="icon icon-twitter"></i>
                    <span class="icon__fallback-text">Twitter</span></a
                  >
                </li>
                <li>
                  <a
                    class="social-icons__link"
                    href="#"
                    target="_blank"
                    title="Belle Multipurpose Bootstrap 4 Template on Pinterest"
                    ><i class="icon icon-pinterest"></i>
                    <span class="icon__fallback-text">Pinterest</span></a
                  >
                </li>
                <li>
                  <a
                    class="social-icons__link"
                    href="#"
                    target="_blank"
                    title="Belle Multipurpose Bootstrap 4 Template on Instagram"
                    ><i class="icon icon-instagram"></i>
                    <span class="icon__fallback-text">Instagram</span></a
                  >
                </li>
                <li>
                  <a
                    class="social-icons__link"
                    href="#"
                    target="_blank"
                    title="Belle Multipurpose Bootstrap 4 Template on Tumblr"
                    ><i class="icon icon-tumblr-alt"></i>
                    <span class="icon__fallback-text">Tumblr</span></a
                  >
                </li>
                <li>
                  <a
                    class="social-icons__link"
                    href="#"
                    target="_blank"
                    title="Belle Multipurpose Bootstrap 4 Template on YouTube"
                    ><i class="icon icon-youtube"></i>
                    <span class="icon__fallback-text">YouTube</span></a
                  >
                </li>
                <li>
                  <a
                    class="social-icons__link"
                    href="#"
                    target="_blank"
                    title="Belle Multipurpose Bootstrap 4 Template on Vimeo"
                    ><i class="icon icon-vimeo-alt"></i>
                    <span class="icon__fallback-text">Vimeo</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="site-footer">
      <div class="container">
        <!--Footer Links-->
        <div class="footer-top">
          <div class="row">
            <div class="col-12 col-sm-12 col-md-3 col-lg-3 footer-links">
              <h4 class="h4">Quick Shop</h4>
              <ul>
                <li v-for="category in categories" :key="category.slug">
                  <NuxtLink :to="`/shop?category=${category.slug}`">{{
                    category.label
                  }}</NuxtLink>
                </li>
              </ul>
            </div>
            <div class="col-12 col-sm-12 col-md-3 col-lg-3 footer-links">
              <h4 class="h4">Informations</h4>
              <ul>
                <li><NuxtLink to="/about-us">About us</NuxtLink></li>
                <li><NuxtLink to="/faq">FAQ's</NuxtLink></li>
              </ul>
            </div>
            <div class="col-12 col-sm-12 col-md-3 col-lg-3 footer-links">
              <h4 class="h4">Customer Services</h4>
              <ul>
                <li><NuxtLink to="/faq">FAQ's</NuxtLink></li>
                <li><NuxtLink to="/cart">Cart</NuxtLink></li>
                <li><NuxtLink to="/wishlist">Wishlist</NuxtLink></li>
              </ul>
            </div>
            <div class="col-12 col-sm-12 col-md-3 col-lg-3 footer-links">
              <h4 class="h4">Pages</h4>
              <ul>
                <li><NuxtLink to="/">Home</NuxtLink></li>
                <li><NuxtLink to="/shop">Shop</NuxtLink></li>
                <li><NuxtLink to="/collection">Collection</NuxtLink></li>
                <li><NuxtLink to="/about-us">About Us</NuxtLink></li>
                <li><NuxtLink to="/faq">FAQs</NuxtLink></li>
              </ul>
            </div>
          </div>
        </div>
        <!--End Footer Links-->
        <hr />
        <div class="footer-bottom">
          <div class="row">
            <!--Footer Copyright-->
            <div
              class="col-12 col-sm-12 col-md-12 col-lg-12 copyright text-center"
            >
              <span>&copy; {{ new Date().getFullYear() }} Belle Store. All rights reserved.</span>
            </div>
            <!--End Footer Copyright-->
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { categories } from "@/data/categories.js";
</script>
