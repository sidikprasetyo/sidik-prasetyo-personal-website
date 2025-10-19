"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import { GoDotFill } from "react-icons/go";
import { LoadingOverlay } from "@/components/LoadingOverlay";

interface Portfolio {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  link: string;
  portfolio_images: { id: string; image_url: string }[];
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetch("/api/portfolios")
      .then((res) => res.json())
      .then(setPortfolios)
      .catch(console.error);
  }, []);

  if (isLoading) return <LoadingOverlay open={isLoading} />;

  return (
    <section
      className="mx-auto min-h-screen px-4 sm:px-8 md:px-16 lg:px-20 py-10 bg-[#f3f3f3] text-[#222222]"
      data-aos="fade-up"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div
          className="inline-flex items-center bg-[#ffffff] py-1 px-3 rounded-full"
          data-aos="zoom-in"
        >
          <GoDotFill size={20} className="text-[#222222]" />
          <h2 className="text-sm font-medium ml-1">Portfolio</h2>
        </div>

        <Link
          href="/"
          className="text-gray-600 hover:text-[#7b7b7b] text-sm flex items-center transition-colors"
          data-aos="zoom-in"
        >
          <HiOutlineArrowNarrowLeft className="inline-block mr-1 translate-y-0.5" />
          Back to Home
        </Link>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center sm:text-left mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222]">
          My Latest Works
        </h2>
        <p className="text-gray-600 mt-2 leading-snug text-sm sm:text-base">
          A showcase of my web and IoT projects — combining creativity, design,
          and technology.
        </p>
      </div>

      {/* Portfolio Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        data-aos="fade-in"
      >
        {portfolios?.map((portfolio) => (
          <Link
            key={portfolio.id}
            href={`/portfolio/${portfolio.id}`}
            className="group relative transition-shadow duration-300"
            data-aos="flip-left"
          >
            <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500">
              {portfolio.portfolio_images?.[0] ? (
                <img
                  src={portfolio.portfolio_images[0].image_url}
                  alt={portfolio.title}
                  className="w-full h-52 sm:h-60 md:h-50 lg:h-60 object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-52 sm:h-60 md:h-50 lg:h-60 bg-gray-300 rounded-xl flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
            </div>

            {/* Floating Icon */}
            <HiArrowUpRight className="absolute top-4 right-4 text-gray-500 text-xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 group-hover:text-blue-500" />

            {/* Title & Excerpt */}
            <div className="mt-3">
              <h3 className="text-base md:text-lg font-semibold text-[#222] group-hover:text-[#7b7b7b] transition-colors duration-300">
                {portfolio.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2 group-hover:text-[#7b7b7b] transition-colors duration-300">
                {portfolio.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
