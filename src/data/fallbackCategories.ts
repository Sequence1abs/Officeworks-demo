import type { CategoryWithCount } from "@/types/category";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const STATIC_CATEGORIES: { title: string; id: number; img: string }[] = [
  { title: "Seth Products", id: 1, img: "/images/categories/gen-filing.png" },
  { title: "Accessories", id: 2, img: "/images/categories/gen-tech.png" },
  { title: "Board", id: 3, img: "/images/categories/gen-general-stationery.png" },
  { title: "Books", id: 4, img: "/images/categories/gen-general-stationery.png" },
  { title: "Computer Stationery", id: 5, img: "/images/categories/gen-tech.png" },
  { title: "Filing And Storage", id: 6, img: "/images/categories/gen-filing.png" },
  { title: "General Stationery", id: 7, img: "/images/categories/gen-general-stationery.png" },
  { title: "Office Stationery", id: 8, img: "/images/categories/gen-general-stationery.png" },
  { title: "Packaging Materials", id: 9, img: "/images/categories/gen-filing.png" },
  { title: "Photocopy Papers", id: 10, img: "/images/categories/gen-filing.png" },
  { title: "School Stationery", id: 11, img: "/images/categories/gen-general-stationery.png" },
];

export function getFallbackCategories(): CategoryWithCount[] {
  return STATIC_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.title,
    slug: slugify(c.title),
    productCount: 0,
    img: { key: "default", url: c.img },
  }));
}
