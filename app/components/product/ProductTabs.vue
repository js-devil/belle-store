<template>
  <div class="tabs-listing" ref="tabsEl">
    <ul class="product-tabs">
      <li :class="{ active: activeTab === 'details' }">
        <a href="#" @click.prevent="activeTab = 'details'">Product Details</a>
      </li>
      <li :class="{ active: activeTab === 'reviews' }">
        <a href="#" @click.prevent="activeTab = 'reviews'"
          >Reviews ({{ product.reviews.length }})</a
        >
      </li>
      <li v-if="product.sizeChart" :class="{ active: activeTab === 'sizeChart' }">
        <a href="#" @click.prevent="activeTab = 'sizeChart'">Size Chart</a>
      </li>
      <li :class="{ active: activeTab === 'shipping' }">
        <a href="#" @click.prevent="activeTab = 'shipping'">Shipping &amp; Returns</a>
      </li>
    </ul>
    <div class="tab-container">
      <div v-if="activeTab === 'details'" class="tab-content" style="display: block">
        <div class="product-description rte">
          <ul>
            <li v-for="detail in product.details" :key="detail">{{ detail }}</li>
          </ul>
        </div>
      </div>

      <div v-else-if="activeTab === 'reviews'" class="tab-content" style="display: block">
        <div class="spr-container">
          <div class="spr-header">
            <div class="spr-summary">
              <span class="spr-summary-starrating"
                >{{ "★".repeat(product.rating) }}{{ "☆".repeat(5 - product.rating) }}</span
              >
              <span class="spr-summary-caption"
                >Based on {{ product.reviews.length }} reviews</span
              >
            </div>
          </div>
          <div v-if="product.reviews.length === 0" class="spr-no-reviews">
            No reviews yet for this product.
          </div>
          <div v-else class="spr-reviews">
            <div v-for="review in product.reviews" :key="review.author + review.date" class="spr-review">
              <div class="spr-review-header">
                <span class="spr-review-header-starratings"
                  >{{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}</span
                >
                <span class="spr-review-header-title">{{ review.title }}</span>
                <span class="spr-review-header-byline"
                  >by {{ review.author }} on {{ review.date }}</span
                >
              </div>
              <div class="spr-review-content">
                <p class="spr-review-content-body">{{ review.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'sizeChart'" class="tab-content" style="display: block">
        <table class="table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Foot Length (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in product.sizeChart" :key="row.size">
              <td>{{ row.size }}</td>
              <td>{{ row.footLengthCm }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="activeTab === 'shipping'" class="tab-content" style="display: block">
        <div class="rte" v-html="product.shippingReturns"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
});

const activeTab = ref("details");
const tabsEl = ref(null);

defineExpose({
  goToReviews: () => {
    activeTab.value = "reviews";
  },
  goToSizeChart: () => {
    if (props.product.sizeChart) activeTab.value = "sizeChart";
  },
});
</script>
