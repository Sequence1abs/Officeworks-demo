import type { Product } from "@/types/product";

/**
 * Static fallback products (A–Z by title) so the home page always shows products
 * when the API returns empty or is unavailable.
 */
const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, productSlug: "atlas-chooty-pen", title: "Atlas Chooty Pen", description: "General stationery, office and school. Atlas Chooty Pen.", price: 45, discountedPrice: 39, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/arrival-latest-01.jpg"], previews: ["/images/products/arrival-latest-01.jpg"] } },
  { id: 2, productSlug: "atlas-chooty-t", title: "Atlas Chooty T", description: "General stationery, office and school. Atlas Chooty T.", price: 50, discountedPrice: 44, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/arrival-latest-02.jpg"], previews: ["/images/products/arrival-latest-02.jpg"] } },
  { id: 3, productSlug: "atlas-cr-book-120-pages", title: "Atlas CR Book 120 pages", description: "Books. Atlas CR Book 120 pages.", price: 120, discountedPrice: 99, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/arrival-latest-03.jpg"], previews: ["/images/products/arrival-latest-03.jpg"] } },
  { id: 4, productSlug: "box-file-2-seth", title: "Box file 2' Seth", description: "Seth box file 2 inch. Seth Products.", price: 380, discountedPrice: 349, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/arrival-latest-04.jpg"], previews: ["/images/products/arrival-latest-04.jpg"] } },
  { id: 5, productSlug: "casio-mj120d-calculator-12-month-warranty", title: "Casio MJ120D Calculator - 12 Month Warranty", description: "Computer stationery. Casio MJ120D calculator with warranty.", price: 1850, discountedPrice: 1699, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/arrival-latest-05.jpg"], previews: ["/images/products/arrival-latest-05.jpg"] } },
  { id: 6, productSlug: "color-board-a4-size", title: "Color Board A4 Size", description: "Board. Color board A4 size.", price: 95, discountedPrice: 79, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-5-sm-2.png"], previews: ["/images/products/product-5-sm-2.png"] } },
  { id: 7, productSlug: "half-file-seth", title: "Half file Seth", description: "Seth half file. Seth Products.", price: 180, discountedPrice: 159, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-new-03.jpg"], previews: ["/images/products/product-new-03.jpg"] } },
  { id: 8, productSlug: "m-holder-6-12-colors", title: "M Holder 6' 12 Colors", description: "Seth M Holder 6 inch, 12 colors. Accessories.", price: 350, discountedPrice: 299, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-new-01.jpg"], previews: ["/images/products/product-new-01.jpg"] } },
  { id: 9, productSlug: "m-holders-3-seth", title: "M Holders 3' Seth", description: "Seth M Holders 3 inch. Accessories.", price: 220, discountedPrice: 199, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-new-01.jpg"], previews: ["/images/products/product-new-01.jpg"] } },
  { id: 10, productSlug: "m-holders-4-seth", title: "M Holders 4' Seth", description: "Seth M Holders 4 inch. Accessories.", price: 280, discountedPrice: 249, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-new-01.jpg"], previews: ["/images/products/product-new-01.jpg"] } },
  { id: 11, productSlug: "no-02-seth-box-file", title: "No-02 Seth Box File", description: "Seth Products box file. Durable filing.", price: 450, discountedPrice: 399, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-new-02.jpg"], previews: ["/images/products/product-new-02.jpg"] } },
  { id: 12, productSlug: "seth-box-file-color-laminated", title: "Seth Box File Color Laminated", description: "Color laminated Seth box file. Seth Products.", price: 520, discountedPrice: 449, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-new-05.jpg"], previews: ["/images/products/product-new-05.jpg"] } },
  { id: 13, productSlug: "two-ring-a4-seth-brand-file-cover-holder-12-colour", title: "Two ring A4 Seth Brand File Cover holder (12 Colour)", description: "Seth two ring A4 file cover, 12 colours. Seth Products.", price: 420, discountedPrice: 379, stock: 50, reviews: 0, imgs: { thumbnails: ["/images/products/product-new-04.jpg"], previews: ["/images/products/product-new-04.jpg"] } },
];

export function getFallbackProducts(): Product[] {
  return [...FALLBACK_PRODUCTS].sort((a, b) => a.title.localeCompare(b.title, "en"));
}

export default FALLBACK_PRODUCTS;
