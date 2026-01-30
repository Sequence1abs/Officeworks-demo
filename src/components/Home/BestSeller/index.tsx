"use client";
import React, { useEffect, useMemo } from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { fetchProducts, selectProducts, selectProductsLoading, selectProductsError } from "@/redux/features/product-slice";
import { getFallbackProducts } from "@/data/fallbackProducts";

const BestSeller = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useAppSelector(selectProducts);
  const isLoading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  
  useEffect(() => {
    dispatch(fetchProducts({ limit: 6, sort: "title_asc" }));
  }, [dispatch]);

  const displayProducts = useMemo(() => {
    if (isLoading || error) return [];
    if (products.length > 0) return [...products].sort((a, b) => a.title.localeCompare(b.title, "en")).slice(0, 6);
    return getFallbackProducts().slice(0, 6);
  }, [products, isLoading, error]);
  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              Top Sellers
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Best Sellers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="col-span-full rounded-lg border border-red-200 bg-red-50 p-4 text-left">
              <p className="font-semibold text-red-700 mb-2">Error loading products</p>
              <pre className="whitespace-pre-wrap break-words text-sm text-red-800 font-mono bg-white/80 p-3 rounded border border-red-100 max-h-48 overflow-auto">
                {error}
              </pre>
              <button
                type="button"
                onClick={() => dispatch(fetchProducts({ limit: 6, sort: "title_asc" }))}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          ) : (
            displayProducts.map((item, key) => (
              <SingleItem item={item} key={key} />
            ))
          )}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
