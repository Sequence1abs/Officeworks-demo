"use server"
import { cookies } from "next/headers";
import { db } from "@/database/db";
import { and, asc, between, count, desc, eq, inArray, sql } from "drizzle-orm";
import {
	products,
	categories,
	productCategories,
	carts,
	cartItems,
	wishlists,
	wishlistItems,
} from "@/database/schema";
import type { ListedProduct } from "@/types/product";
import { ListProductsParams } from "@/types/product";
import { CategoryWithCount } from "@/types/category";

export async function listProducts(params: ListProductsParams = {}): Promise<ListedProduct[]> {
  try {
	const { 
	  limit = 9, 
	  offset = 0, 
	  categorySlugs = [], 
	  categoryIds = [],
	  minPrice = 0,
	  maxPrice = 1999,
	  sort = "latest" 
	} = params;

	// Validate numeric parameters
	if (limit < 1 || limit > 20) {
	  throw new Error("Limit must be between 1 and 20");
	}
	
	if (offset < 0) {
	  throw new Error("Offset must be non-negative");
	}

	// Validate price range
	if (minPrice < 0) {
	  throw new Error("Minimum price must be non-negative");
	}
	
	if (maxPrice < 0) {
	  throw new Error("Maximum price must be non-negative");
	}
	
	if (minPrice > maxPrice) {
	  throw new Error("Minimum price cannot be greater than maximum price");
	}

	// Build orderBy clause
	let orderByClause;
	switch (sort) {
	  case "price_asc": orderByClause = [asc(products.discountedPrice)];
		break;
	  case "price_desc": orderByClause = [desc(products.discountedPrice)];
		break;
	  case "title_asc": orderByClause = [asc(products.title)];
		break;
	  case "title_desc": orderByClause = [desc(products.title)];
		break;
	  case "latest": orderByClause = [desc(products.id)];
		break;
	  case "oldest": orderByClause = [asc(products.id)];
		break;
	  default: orderByClause = [asc(products.title)];
		break;
	}

	// Build where conditions array
	const whereConditions = [];
	
	// Add price range filter (always applied with defaults: 0 to 1999)
	whereConditions.push(between(products.discountedPrice, minPrice.toString(), maxPrice.toString()));
	
	// Handle category filtering by IDs (preferred) or resolve slugs to IDs
	let effectiveCategoryIds: number[] = [];
	if (categoryIds && categoryIds.length > 0) {
	  effectiveCategoryIds = categoryIds;
	} else if (categorySlugs && categorySlugs.length > 0) {
	  const rows = await db
		.select({ id: categories.id })
		.from(categories)
		.where(inArray(categories.slug, categorySlugs))
		.catch(error => {
		  throw new Error(`Failed to resolve category slugs: ${error.message}`);
		});
	  effectiveCategoryIds = rows.map(r => r.id);
	}

	if (effectiveCategoryIds.length > 0) {
	  const categoryProducts = await db
		.select({ productId: productCategories.productId })
		.from(productCategories)
		.where(inArray(productCategories.categoryId, effectiveCategoryIds))
		.catch(error => {
		  throw new Error(`Failed to fetch category products: ${error.message}`);
		});

	  const allowedProductIds = categoryProducts.map(r => r.productId);
	  if (allowedProductIds.length === 0) {
		return [];
	  }
	  whereConditions.push(inArray(products.id, allowedProductIds));
	}
	
	// Combine all where conditions
	const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

	const productsWithImages = await db.query.products.findMany({
	  columns: {
		id: true,
		title: true,
		price: true,
		stock: true,
		productSlug: true,
		discountedPrice: true,
		reviewsCount: true,
		description: true,
		imagesArray: true,
	  },
	  limit: limit,
	  offset: offset,
	  where: whereClause,
	  orderBy: orderByClause,
	}).catch(error => {
	  throw new Error(`Failed to fetch products: ${error.message}`);
	});

	console.log('listProducts called')

	return productsWithImages as ListedProduct[];

  } catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	const hint = !process.env.DATABASE_URL ? " (Set DATABASE_URL in .env)" : "";
	throw new Error(`Failed to fetch products: ${message}${hint}`);
  }
}

// Full-text search on products.title (A) and products.description (B)
// Uses websearch_to_tsquery for user-friendly query syntax
export async function searchProducts(params: {
	query: string;
	limit?: number;
	offset?: number;
}): Promise<ListedProduct[]> {
	const {
		query,
		limit = 10,
		offset = 0,
	} = params;

	if (!query || query.trim().length === 0) return [];

	// Build base match expression (must mirror the index columns/weights)
	const matchVector = sql`(
		setweight(to_tsvector('english', ${products.title}), 'A') ||
		setweight(to_tsvector('english', coalesce(${products.description}, '')), 'B')
	)`;
	const tsQuery = sql`websearch_to_tsquery('english', ${query})`;

	// Compose WHERE conditions (full-text match only)
	const whereConds = [sql`${matchVector} @@ ${tsQuery}`] as any[];

	// Order by relevance (ts_rank)
	const rankExpr = sql`ts_rank(${matchVector}, ${tsQuery})`;

	const rows = await db
		.select({
			id: products.id,
			title: products.title,
			price: products.price,
			productSlug: products.productSlug,
			discountedPrice: products.discountedPrice,
			reviewsCount: products.reviewsCount,
			description: products.description,
			imagesArray: products.imagesArray,
			// rank: rankExpr, // if you need to expose rank
		})
		.from(products)
		.where(and(...whereConds))
		.orderBy(sql`${rankExpr} desc`)
		.limit(limit)
		.offset(offset)
		.catch(error => {
			throw new Error(`Failed to search products: ${error.message}`);
		});

	return rows as unknown as ListedProduct[];
}

export async function getProduct(productSlug: string): Promise<ListedProduct | null> {
	try {
		const product = await db.query.products.findFirst({
			columns: {
				id: true,
				productSlug: true,
				title: true,
				price: true,
				stock: true,
				discountedPrice: true,
				reviewsCount: true,
				description: true,
				imagesArray: true,
				detiledDescription: true,
			},
			where: eq(products.productSlug, productSlug),
		}).catch(error => {
			throw new Error(`Failed to fetch product: ${error.message}`);
		});

		console.log("getProduct called for productSlug:", productSlug);
		return product as ListedProduct | null;
	} catch (error) {
		console.error("Error in getProduct:", error);
		return null;
	}
}

export async function listCategoriesWithCounts(): Promise<CategoryWithCount[]> {
	try {
		const rows = await db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
				img: categories.img,
				productCount: count(productCategories.productId).mapWith(Number),
			})
			.from(categories)
			.leftJoin(productCategories, eq(categories.id, productCategories.categoryId))
			.groupBy(categories.id, categories.name, categories.slug, categories.img);

		console.log("listCategoriesWithCounts called");
		return rows as CategoryWithCount[];
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		const hint = !process.env.DATABASE_URL
			? " (DATABASE_URL is missing in .env)"
			: "";
		throw new Error(`Failed to fetch categories: ${message}${hint}`);
	}
}

async function getUserCart(ownerId: string) {
	try {
		let userCart = await db.select().from(carts).where(eq(carts.ownerId, ownerId)).limit(1);
		
		if (!userCart.length) {
			const [newCart] = await db.insert(carts).values({
				ownerId,
				status: "active"
			}).returning();
			userCart = [newCart];
		}

		const cartItemsData = await db.query.cartItems.findMany({
			columns: {
				id: true,
				quantity: true,
			},
			where: eq(cartItems.cartId, userCart[0].id),
			with: {
				product: {
					columns: {
						id: true,
						title: true,
						price: true,
						stock: true,
						productSlug: true,
						discountedPrice: true,
						imagesArray: true,
						description: true,
					},
				},
			},
		});
		
		return cartItemsData;
	} catch (error) {
		console.error('Error getting user cart:', error);
		return [];
	}
}

 async function addToCart(ownerId: string, productId: number, quantity: number = 1) {
	// we should take the product details snapshot from the client side
	try {
		let userCart = await db.select().from(carts).where(eq(carts.ownerId, ownerId)).limit(1);
		
		if (!userCart.length) {
			const [newCart] = await db.insert(carts).values({
				ownerId,
				status: "active"
			}).returning();
			userCart = [newCart];
		}

		// Check if item already exists in cart
		const existingItem = await db
			.select()
			.from(cartItems)
			.where(and(eq(cartItems.cartId, userCart[0].id), eq(cartItems.productId, productId)))
			.limit(1);

		if (existingItem.length > 0) {
			// Update quantity
			await db
				.update(cartItems)
				.set({ quantity: existingItem[0].quantity + quantity })
				.where(eq(cartItems.id, existingItem[0].id));
		} else {
			// Add new item
			await db.insert(cartItems).values({
				cartId: userCart[0].id,
				productId,
				quantity,
			});
		}

		return { success: true };
	} catch (error) {
		console.error('Error adding to cart:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

 async function updateCartItemQuantity(ownerId: string, productId: number, quantity: number) {
	try {
		const userCart = await db.select().from(carts).where(eq(carts.ownerId, ownerId)).limit(1);
		if (!userCart.length) throw new Error('Cart not found');

			// Update quantity
			await db
				.update(cartItems)
				.set({ quantity })
				.where(and(eq(cartItems.cartId, userCart[0].id), eq(cartItems.productId, productId)));

		return { success: true };
	} catch (error) {
		console.error('Error updating cart item:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

 async function removeFromCart(ownerId: string, productId: number) {
	try {
		const userCart = await db.select().from(carts).where(eq(carts.ownerId, ownerId)).limit(1);
		if (!userCart.length) throw new Error('Cart not found');

		await db
			.delete(cartItems)
			.where(and(eq(cartItems.cartId, userCart[0].id), eq(cartItems.productId, productId)));

		return { success: true };
	} catch (error) {
		console.error('Error removing from cart:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Wishlist Actions
 async function getUserWishlist(ownerId: string) {
	try {
		// Get or create wishlist for user
		let userWishlist = await db.select().from(wishlists).where(eq(wishlists.ownerId, ownerId)).limit(1);
		
		if (!userWishlist.length) {
			const [newWishlist] = await db.insert(wishlists).values({
				ownerId
			}).returning();
			userWishlist = [newWishlist];
		}

		// Get wishlist items with product details
		const wishlistItemsData = await db.query.wishlistItems.findMany({
			columns: {
				id: true,
				productId: true,
			},
			where: eq(wishlistItems.wishlistId, userWishlist[0].id),
			with: {
				product: {
					columns: {
						id: true,
						title: true,
						price: true,
						stock: true,
						productSlug: true,
						discountedPrice: true,
						imagesArray: true,
						description: true,
					},
				},
			},
		});

		return wishlistItemsData;
			
	} catch (error) {
		console.error('Error getting user wishlist:', error);
		return [];
	}
}

 async function addToWishlist(ownerId: string, productId: number) {
	try {
		// Get or create wishlist
		let userWishlist = await db.select().from(wishlists).where(eq(wishlists.ownerId, ownerId)).limit(1);
		
		if (!userWishlist.length) {
			const [newWishlist] = await db.insert(wishlists).values({
				ownerId
			}).returning();
			userWishlist = [newWishlist];
		}

		// Check if already in wishlist
		const existingItem = await db
			.select()
			.from(wishlistItems)
			.where(and(eq(wishlistItems.wishlistId, userWishlist[0].id), eq(wishlistItems.productId, productId)))
			.limit(1);

		if (existingItem.length > 0) {
			return { success: false, error: 'Item already in wishlist' };
		}

		// Add to wishlist
		await db.insert(wishlistItems).values({
			wishlistId: userWishlist[0].id,
			productId,
		});

		return { success: true };
	} catch (error) {
		console.error('Error adding to wishlist:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

 async function removeFromWishlist(ownerId: string, productId: number) {
	try {
		const userWishlist = await db.select().from(wishlists).where(eq(wishlists.ownerId, ownerId)).limit(1);
		if (!userWishlist.length) throw new Error('Wishlist not found');

		await db
			.delete(wishlistItems)
			.where(and(eq(wishlistItems.wishlistId, userWishlist[0].id), eq(wishlistItems.productId, productId)));

		return { success: true };
	} catch (error) {
		console.error('Error removing from wishlist:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

const GUEST_COOKIE_NAME = "guest_id";

async function getGuestId(): Promise<string> {
	const cookieStore = await cookies();
	let guestId = cookieStore.get(GUEST_COOKIE_NAME)?.value;
	if (!guestId) {
		guestId = crypto.randomUUID();
		cookieStore.set(GUEST_COOKIE_NAME, guestId, { path: "/", maxAge: 60 * 60 * 24 * 365 });
	}
	return guestId;
}

export async function addToCartForUser(productId: number, quantity: number = 1) {
	const ownerId = await getGuestId();
	return await addToCart(ownerId, productId, quantity);
}

export async function updateCartItemQuantityForUser(productId: number, quantity: number) {
	const ownerId = await getGuestId();
	return await updateCartItemQuantity(ownerId, productId, quantity);
}

export async function removeFromCartForUser(productId: number) {
	const ownerId = await getGuestId();
	return await removeFromCart(ownerId, productId);
}

export async function getUserCartForUser() {
	const ownerId = await getGuestId();
	return await getUserCart(ownerId);
}

export async function addToWishlistForUser(productId: number) {
	const ownerId = await getGuestId();
	return await addToWishlist(ownerId, productId);
}

export async function removeFromWishlistForUser(productId: number) {
	const ownerId = await getGuestId();
	return await removeFromWishlist(ownerId, productId);
}

export async function getUserWishlistForUser() {
	const ownerId = await getGuestId();
	return await getUserWishlist(ownerId);
}