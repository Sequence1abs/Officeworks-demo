/**
 * Seed sample products (Officeworks-style) so the shop and home page show products.
 * Run after seed:officeworks if you want category links: pnpm run seed:officeworks && pnpm run seed:products
 * Or run alone: pnpm run seed:products
 */
import "dotenv/config";
import { db } from "./db";
import { products, categories, productCategories } from "./schema";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const SAMPLE_PRODUCTS = [
  { title: "No-02 Seth Box File", price: "450", discountedPrice: "399", description: "Seth Products box file. Durable filing.", img: "/images/products/product-1-sm-1.png" },
  { title: "M Holders 4' Seth", price: "280", discountedPrice: "249", description: "Seth M Holders 4 inch. Accessories.", img: "/images/products/product-2-sm-1.png" },
  { title: "M Holders 3' Seth", price: "220", discountedPrice: "199", description: "Seth M Holders 3 inch. Accessories.", img: "/images/products/product-3-sm-1.png" },
  { title: "M Holder 6' 12 Colors", price: "350", discountedPrice: "299", description: "Seth M Holder 6 inch, 12 colors. Accessories.", img: "/images/products/product-4-sm-1.png" },
  { title: "Half file Seth", price: "180", discountedPrice: "159", description: "Seth half file. Seth Products.", img: "/images/products/product-5-sm-1.png" },
  { title: "Box file 2' Seth", price: "380", discountedPrice: "349", description: "Seth box file 2 inch. Seth Products.", img: "/images/products/product-6-sm-1.png" },
  { title: "Seth Box File Color Laminated", price: "520", discountedPrice: "449", description: "Color laminated Seth box file. Seth Products.", img: "/images/products/product-7-sm-1.png" },
  { title: "Two ring A4 Seth Brand File Cover holder (12 Colour)", price: "420", discountedPrice: "379", description: "Seth two ring A4 file cover, 12 colours. Seth Products.", img: "/images/products/product-8-sm-1.png" },
  { title: "Atlas Chooty Pen", price: "45", discountedPrice: "39", description: "General stationery, office and school. Atlas Chooty Pen.", img: "/images/products/product-1-sm-2.png" },
  { title: "Atlas Chooty T", price: "50", discountedPrice: "44", description: "General stationery, office and school. Atlas Chooty T.", img: "/images/products/product-2-sm-2.png" },
  { title: "Atlas CR Book 120 pages", price: "120", discountedPrice: "99", description: "Books. Atlas CR Book 120 pages.", img: "/images/products/product-3-sm-2.png" },
  { title: "Casio MJ120D Calculator - 12 Month Warranty", price: "1850", discountedPrice: "1699", description: "Computer stationery. Casio MJ120D calculator with warranty.", img: "/images/products/product-4-sm-2.png" },
  { title: "Color Board A4 Size", price: "95", discountedPrice: "79", description: "Board. Color board A4 size.", img: "/images/products/product-5-sm-2.png" },
];

async function seedProducts() {
  const productRows = SAMPLE_PRODUCTS.map((p) => ({
    productSlug: slugify(p.title),
    title: p.title,
    price: p.price,
    discountedPrice: p.discountedPrice,
    stock: 50,
    description: p.description ?? "",
    imagesArray: [{ key: "main", url: p.img }],
  }));

  await db.insert(products).values(productRows).onConflictDoNothing({ target: [products.productSlug] });

  // Link products to categories by name (run after seed:officeworks for categories to exist)
  const inserted = await db.select({ id: products.id, productSlug: products.productSlug }).from(products);
  const categoryRows = await db.select({ id: categories.id, slug: categories.slug }).from(categories);

  const slugToCategoryId = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const sethId = slugify("Seth Products");
  const accessoriesId = slugify("Accessories");
  const generalId = slugify("General Stationery");
  const booksId = slugify("Books");
  const computerId = slugify("Computer Stationery");
  const boardId = slugify("Board");

  const links: { productId: number; categoryId: number }[] = [];
  for (const p of inserted) {
    const slug = p.productSlug;
    if (slug.includes("seth") || slug.includes("box-file") || slug.includes("half-file") || slug.includes("holder") || slug.includes("file-cover")) {
      const cid = slugToCategoryId.get(sethId) ?? slugToCategoryId.get(accessoriesId);
      if (cid) links.push({ productId: p.id, categoryId: cid });
    }
    if (slug.includes("holder")) {
      const cid = slugToCategoryId.get(accessoriesId);
      if (cid) links.push({ productId: p.id, categoryId: cid });
    }
    if (slug.includes("atlas") || slug.includes("chooty")) {
      const cid = slugToCategoryId.get(generalId);
      if (cid) links.push({ productId: p.id, categoryId: cid });
    }
    if (slug.includes("book")) {
      const cid = slugToCategoryId.get(booksId);
      if (cid) links.push({ productId: p.id, categoryId: cid });
    }
    if (slug.includes("casio") || slug.includes("calculator")) {
      const cid = slugToCategoryId.get(computerId);
      if (cid) links.push({ productId: p.id, categoryId: cid });
    }
    if (slug.includes("board")) {
      const cid = slugToCategoryId.get(boardId);
      if (cid) links.push({ productId: p.id, categoryId: cid });
    }
  }

  const uniqueLinks = Array.from(new Map(links.map((l) => [`${l.productId}-${l.categoryId}`, l])).values());
  if (uniqueLinks.length > 0) {
    await db
      .insert(productCategories)
      .values(uniqueLinks)
      .onConflictDoNothing({ target: [productCategories.productId, productCategories.categoryId] });
  }

  console.log("Products seeded successfully.");
}

seedProducts().catch((err) => {
  console.error(err);
  process.exit(1);
});
