"use client";
import { useCallback, useRef, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { fetchCategoriesWithCounts, selectCategories, selectCategoriesLoading, selectCategoriesError } from "@/redux/features/category-slice";
import type { AppDispatch } from "@/redux/store";
import { getFallbackCategories } from "@/data/fallbackCategories";
import SingleItem from "./SingleItem";

const AUTOPLAY_DELAY_MS = 3000;

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);
  const rowRef = useRef<HTMLDivElement | null>(null);

  const getStep = useCallback((el: HTMLDivElement) => {
    if (!el.firstElementChild) return el.clientWidth / 6;
    const itemWidth = (el.firstElementChild as HTMLElement).offsetWidth;
    return itemWidth + 20;
  }, []);

  const scrollTo = useCallback((direction: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;
    const step = getStep(el);
    const amount = direction === "right" ? step : -step;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, [getStep]);

  const autoScrollRight = useCallback(() => {
    const el = rowRef.current;
    if (!el || !el.firstElementChild) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const step = getStep(el);
    const atEnd = el.scrollLeft >= maxScroll - 5;

    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollTo({ left: Math.min(maxScroll, el.scrollLeft + step), behavior: "smooth" });
    }
  }, [getStep]);

  useEffect(() => {
    dispatch(fetchCategoriesWithCounts());
  }, [dispatch]);

  const displayCategories = useMemo(() => {
    if (categories.length > 0) return categories;
    return getFallbackCategories();
  }, [categories]);

  useEffect(() => {
    if (loading || error || displayCategories.length === 0) return;
    const initialDelay = 1200;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startId = setTimeout(() => {
      autoScrollRight();
      intervalId = setInterval(autoScrollRight, AUTOPLAY_DELAY_MS);
    }, initialDelay);
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading, error, displayCategories.length, autoScrollRight]);

  return (
    <section className="overflow-hidden pt-12">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-10 border-b border-gray-3">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="flex items-center gap-2 font-medium text-[#1e3a5f] text-sm mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1e3a5f] shrink-0">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Categories
            </span>
            <h2 className="font-bold text-2xl xl:text-3xl text-[#1e3a5f] tracking-tight">
              Browse by Category
            </h2>
            {loading && (
              <div className="flex justify-center h-32 items-center mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="ml-2 text-gray-600">Loading categories...</span>
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left mt-4">
                <p className="font-semibold text-red-700 mb-2">Error loading categories</p>
                <pre className="whitespace-pre-wrap break-words text-sm text-red-800 font-mono bg-white/80 p-3 rounded border border-red-100 max-h-64 overflow-auto">{error}</pre>
                <button onClick={() => dispatch(fetchCategoriesWithCounts())} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">Retry</button>
              </div>
            )}
          </div>
          {!loading && !error && displayCategories.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollTo("left")}
                className="w-10 h-10 rounded-md bg-white border border-gray-3 flex items-center justify-center text-dark hover:border-blue hover:text-blue transition-colors shrink-0"
                aria-label="Previous categories"
              >
                <svg className="w-5 h-5 current-color" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollTo("right")}
                className="w-10 h-10 rounded-md bg-white border border-gray-3 flex items-center justify-center text-dark hover:border-blue hover:text-blue transition-colors shrink-0"
                aria-label="Next categories"
              >
                <svg className="w-5 h-5 current-color" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {!loading && !error && (
          <div
            ref={rowRef}
            className="flex flex-nowrap gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {displayCategories.map((item, key) => (
              <div
                key={item.id ?? key}
                className="flex-shrink-0 snap-start w-[calc((100%-5*1rem)/6)] sm:w-[calc((100%-5*1.25rem)/6)]"
              >
                <SingleItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
