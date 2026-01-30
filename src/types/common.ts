// Small helpers to compose domain types without repeating fields
export type WithQuantity<T> = T & { quantity: number };
export type WithStatus<T> = T & { status?: string };

// Sorting options used across product listings
export type ProductSortOption = 'latest' | 'oldest' | 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';
