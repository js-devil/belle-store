<template>
  <div id="page-content">
    <div class="page section-header text-center">
      <div class="page-title">
        <div class="wrapper"><h1 class="page-width">FAQs</h1></div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 main-col">
          <FaqAccordion :groups="faqGroups" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const faqGroups = [
  {
    title: "Orders & Payment",
    items: [
      {
        question: "Is this a real store - will I be charged if I check out?",
        answer:
          "No. Belle Store is a research prototype built for a study on 3D product visualization. You can browse, add items to your cart or wishlist, and go through checkout, but payment is disabled and no real orders or charges are made.",
      },
      {
        question: "Can I view prices in Naira or US Dollars?",
        answer:
          "Yes. Use the country selector in the top bar to switch between Nigeria (Naira, ₦) and United States (US Dollars, $). Prices update instantly across the whole site, including product pages, your cart and your wishlist, and your choice is remembered on your next visit.",
      },
      {
        question: "Do I need an account to shop?",
        answer:
          "No account is required. Your cart, wishlist and currency preference are saved in your browser so they're still there if you come back later on the same device.",
      },
    ],
  },
  {
    title: "Products & Sizing",
    items: [
      {
        question: "How do I know what size to order for shoes?",
        answer:
          "Every shoe product page has a Size Chart tab with foot-length measurements for each available size, alongside the size selector.",
      },
      {
        question: "How does the 3D product viewer work?",
        answer:
          "Products with a 3D model show a play button next to the main photo - tap or click it to open an interactive viewer. Drag (or swipe on touch devices) to rotate the model, scroll or pinch to zoom, and use the expand icon for a fullscreen view. Some products also let you preview different colour options directly on the 3D model.",
      },
      {
        question: "Which products have a 3D preview?",
        answer:
          "3D models are available for a growing selection of items across shoes, furniture, jewelry, electronics, bikes and toys. If a product doesn't have a 3D model yet, the play button is simply hidden on that product page - the 2D photos are always available either way.",
      },
      {
        question: "Some products show a placeholder image instead of a photo - why?",
        answer:
          "We're still sourcing final photography for a small number of items. Product information for those items is complete and ready to go - only the imagery is a placeholder until it's replaced.",
      },
    ],
  },
  {
    title: "Shipping & Returns",
    items: [
      {
        question: "Do you deliver across Nigeria?",
        answer:
          "Yes, our shipping copy reflects nationwide delivery within Nigeria, with Lagos deliveries typically arriving fastest. As a prototype, no items are physically shipped.",
      },
      {
        question: "What is your return policy?",
        answer:
          "Standard return windows are shown on each product's Shipping & Returns tab (typically 7-14 days depending on category). Since this is a demo store, returns are not physically processed.",
      },
    ],
  },
];
</script>
