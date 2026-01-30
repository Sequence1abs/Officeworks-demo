/**
 * Seed Officeworks.lk categories into the database.
 * Run with: pnpm run seed:officeworks
 */
import "dotenv/config";
import { db } from "./db";
import { categories } from "./schema";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const OFFICEWORKS_CATEGORIES = [
  { name: "Seth Products", img: "/images/categories/categories-01.png" },
  { name: "Accessories", img: "/images/categories/categories-02.png" },
  { name: "Board", img: "/images/categories/categories-03.png" },
  { name: "Books", img: "/images/categories/categories-04.png" },
  { name: "Computer Stationery", img: "/images/categories/categories-05.png" },
  { name: "Filing And Storage", img: "/images/categories/categories-06.png" },
  { name: "General Stationery", img: "/images/categories/categories-07.png" },
  { name: "Office Stationery", img: "/images/categories/categories-01.png" },
  { name: "Packaging Materials", img: "/images/categories/categories-02.png" },
  { name: "Photocopy Papers", img: "/images/categories/categories-03.png" },
  { name: "School Stationery", img: "/images/categories/categories-04.png" },
];

async function seedOfficeworksCategories() {
  const rows = OFFICEWORKS_CATEGORIES.map((c) => ({
    name: c.name,
    slug: slugify(c.name),
    img: { key: slugify(c.name), url: c.img },
  }));

  await db
    .insert(categories)
    .values(rows)
    .onConflictDoNothing({ target: [categories.slug] });

  console.log("Officeworks categories seeded successfully.");
}

seedOfficeworksCategories().catch((err) => {
  console.error(err);
  process.exit(1);
});
