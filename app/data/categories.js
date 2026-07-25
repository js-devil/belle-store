/**
 * @typedef {Object} Category
 * @property {string} slug
 * @property {string} label
 * @property {string} tileImage
 * @property {string} description
 */

/** @type {Category[]} */
export const categories = [
  {
    slug: "shoes",
    label: "Shoes",
    tileImage: "/images/collection/shoes.jpg",
    description: "Everyday sneakers, sandals and heels for every occasion.",
  },
  {
    slug: "furniture",
    label: "Furniture",
    tileImage: "/images/products/furniture/blush-dome-pendant-lamp/main.jpg",
    description: "Chairs, tables and lighting to furnish any room.",
  },
  {
    slug: "jewelry",
    label: "Jewelry",
    tileImage: "/images/collection/jewellry.jpg",
    description: "Necklaces, earrings and bracelets for every look.",
  },
  {
    slug: "electronics",
    label: "Electronics",
    tileImage: "/images/products/placeholders/electronics.svg",
    description: "Everyday gadgets and accessories for home and on the go.",
  },
  {
    slug: "bikes",
    label: "Bikes",
    tileImage: "/images/products/placeholders/bikes.svg",
    description: "Bicycles and cycling accessories for the city and the trail.",
  },
  {
    slug: "toys",
    label: "Toys",
    tileImage: "/images/products/placeholders/toys.svg",
    description: "Toys and games for kids of every age.",
  },
  {
    slug: "statues",
    label: "Statues",
    tileImage: "/images/products/placeholders/statues.svg",
    description: "Decorative statues and sculptures for home and garden.",
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug);
}
