import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryWithCount } from "@/types/category";

const SingleItem = ({ item }: { item: CategoryWithCount }) => {
  return (
    <Link
      href={`/category/${item.slug}`}
      className="group flex flex-col items-center text-center"
    >
      <div className="w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] rounded-full bg-white border border-gray-3 flex items-center justify-center mb-3 flex-shrink-0 overflow-hidden mx-auto">
        <Image
          src={item.img.url}
          alt={item.name}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <h3 className="font-medium text-[#1e3a5f] text-sm group-hover:text-blue underline-offset-2 group-hover:underline transition-colors">
        {item.name}
      </h3>
    </Link>
  );
};

export default SingleItem;
