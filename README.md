# Belle Store

Belle Store is a multi-category e-commerce prototype (shoes, furniture, jewelry, electronics, bikes, toys and statues) built with Nuxt 4. It exists as the working prototype for a research study, *A Study of 3D Product Visualization and Its Effect on User Engagement in Online Shopping Platforms in Nigeria*, and is designed to be a fully usable storefront - browsing, cart, wishlist and checkout all work end-to-end - with the exception of real payment processing.

Product data is organized per-product (images, pricing, details, reviews) with a reserved `model3d` slot on every product, so 2D product photography can be progressively swapped for interactive 3D models as they're produced for the study, without any changes to the surrounding app. Product pages already include a 3D-preview trigger; it currently shows a "coming soon" placeholder until models are added.

Prices can be viewed in Nigerian Naira or US Dollars via the currency selector in the top bar.

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) and [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
