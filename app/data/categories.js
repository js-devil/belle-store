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
    tileImage: "/models/footwear/sneakers/nike_air_zoom_pegasus_36.jpg",
    description: "Men's, women's and sneaker styles for every occasion.",
  },
  {
    slug: "furniture",
    label: "Furniture",
    tileImage: "/models/furniture/living_room_sofa__furniture.jpg",
    description: "Chairs, tables and lighting to furnish any room.",
  },
  {
    slug: "jewelry",
    label: "Jewelry",
    tileImage: "/models/jewelry/avalon_mcqueeny_ring.jpg",
    description: "Rings, pendants and bridal sets for every look.",
  },
  {
    slug: "electronics",
    label: "Electronics",
    tileImage: "/models/electronics/flat_television.jpg",
    description: "Everyday appliances and gadgets for the home.",
  },
  {
    slug: "bikes",
    label: "Bikes",
    tileImage: "/models/bikes/sports_bike.jpg",
    description: "Bicycles, motorcycles and scooters for the city and beyond.",
  },
  {
    slug: "toys",
    label: "Toys",
    tileImage: "/models/toys/red_speed_car.jpg",
    description: "Toys and games for kids of every age.",
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug);
}

/** @type {{slug: string, label: string}[]} */
export const shoeSubcategories = [
  { slug: "male", label: "Men's Shoes" },
  { slug: "female", label: "Women's Shoes" },
  { slug: "sneakers", label: "Sneakers" },
];
