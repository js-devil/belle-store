<template>
  <div class="section logo-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
          <div class="logo-bar">
            <div v-for="n in 6" :key="n" class="logo-bar__item">
              <img :src="`/images/logo/brandlogo${n}.png`" alt="" title="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
