import { shoes } from "./products/shoes.js";
import { jewelry } from "./products/jewelry.js";
import { furniture } from "./products/furniture.js";
import { bikes } from "./products/bikes.js";
import { electronics } from "./products/electronics.js";
import { toys } from "./products/toys.js";
import { statues } from "./products/statues.js";

export { categories, getCategoryBySlug } from "./categories.js";

/**
 * @typedef {Object} ProductLabel
 * @property {string} text
 * @property {string} class
 *
 * @typedef {Object} ProductReview
 * @property {string} author
 * @property {number} rating
 * @property {string} title
 * @property {string} body
 * @property {string} date
 *
 * @typedef {Object} ProductImages
 * @property {string} primary
 * @property {string} hover
 * @property {string[]} gallery
 *
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} category
 * @property {string} title
 * @property {string} brand
 * @property {number} priceUsd - canonical price, always USD. Format with useCurrency().formatPrice().
 * @property {number|null} compareAtPriceUsd
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string} sku
 * @property {number} stock
 * @property {ProductLabel[]} labels
 * @property {boolean} rectangularLabels
 * @property {string} description - HTML string
 * @property {string[]} details - bullet list for the Product Details tab
 * @property {string} shippingReturns - HTML string
 * @property {{size:string, footLengthCm:number}[]|null} sizeChart - non-null only for shoes
 * @property {string[]|null} sizes
 * @property {{name:string, swatch:string}[]|null} colors
 * @property {ProductImages} images
 * @property {object|null} model3d - RESERVED for a future GLB/USDZ asset. Always null today.
 * @property {ProductReview[]} reviews
 */

/** @type {Product[]} */
export const products = [
  ...shoes,
  ...furniture,
  ...jewelry,
  ...electronics,
  ...bikes,
  ...toys,
  ...statues,
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug) {
  if (!categorySlug) return products;
  return products.filter((product) => product.category === categorySlug);
}

export function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
