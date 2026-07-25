<template>
  <div id="page-content">
    <div class="page section-header text-center">
      <div class="page-title">
        <div class="wrapper"><h1 class="page-width">About Us</h1></div>
      </div>
    </div>

    <div class="container">
      <div class="text-center mb-4">
        <h2 class="h2">Belle Store</h2>
        <div class="rte-setting">
          <p>
            Belle Store is a multi-category online store carrying shoes, furniture,
            jewelry, electronics, bikes, toys and decorative statues in one place. We
            built it as a working prototype for a research study on how 3D product
            visualization affects user engagement on online shopping platforms in
            Nigeria - which means every page here, from browsing to checkout, is fully
            usable so we can learn how real shoppers behave.
          </p>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-sm-4 col-md-4 col-lg-4">
          <img class="blur-up lazyload" data-src="/images/about1.jpg" src="/images/about1.jpg" alt="Belle Store" />
        </div>
        <div class="col-12 col-sm-4 col-md-4 col-lg-4">
          <img class="blur-up lazyload" data-src="/images/about2.jpg" src="/images/about2.jpg" alt="Belle Store" />
        </div>
        <div class="col-12 col-sm-4 col-md-4 col-lg-4">
          <img class="blur-up lazyload" data-src="/images/about3.jpg" src="/images/about3.jpg" alt="Belle Store" />
        </div>
      </div>

      <div class="text-center mt-4 mb-4">
        <h2 class="h2">Why We're Building This</h2>
        <div class="rte-setting">
          <p>
            Product photos only tell you so much before you buy - you can't turn a
            picture around, and a fixed angle rarely captures what an item actually
            looks like from every side. This project explores whether letting shoppers
            rotate and inspect products in 3D changes how confident they feel about a
            purchase. Today, every product on Belle Store uses standard photography;
            the catalog and product pages are already structured to accept a 3D model
            per product, so real 3D views can be added incrementally as they're
            produced without changing how the store works.
          </p>
        </div>
      </div>

      <div class="row align-items-center">
        <div class="col-12 col-sm-12 col-md-6 col-lg-6">
          <div class="custom-text">
            <h4 class="h3">What You Can Do Here</h4>
            <div class="rte-setting">
              <p>
                Browse the full catalog, filter by category, view detailed product
                pages, add items to your cart or wishlist, and walk through checkout -
                everything except real payment, which stays disabled since this is a
                research prototype and not a live store. Prices can be viewed in
                Nigerian Naira or US Dollars using the selector in the top bar.
              </p>
            </div>
          </div>
        </div>
        <ContactInfoBlock />
      </div>
    </div>
  </div>
</template>
