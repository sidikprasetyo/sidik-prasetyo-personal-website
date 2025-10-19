"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

interface Portfolio {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  link: string;
  portfolio_images: { id: string; image_url: string }[];
}

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Lightbox state
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/portfolios/${id}`)
      .then((res) => res.json())
      .then(setPortfolio)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <LoadingOverlay open={true} />;

  if (!portfolio) {
    return (
      <section className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Project not found.</p>
      </section>
    );
  }

  const images =
    portfolio.portfolio_images?.map((img) => ({
      src: img.image_url,
      title: portfolio.title,
    })) || [];

  return (
    <section className="mx-auto min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-10 bg-[#f9f9f9] text-[#222]">
      {/* Header + Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center sm:text-left">{portfolio.title}</h1>
        <Link href="/portfolio" className="text-gray-600 hover:text-[#7b7b7b] text-sm flex items-center justify-center transition-colors">
          <HiOutlineArrowNarrowLeft className="inline-block mr-1 translate-y-0.5" />
          Back to Portfolio
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Left - Image Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden">
          {images.length > 0 && (
            <div className="relative">
              <img src={images[0].src} alt={portfolio.title} className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover rounded-2xl" />
            </div>
          )}
        </div>

        {/* Right - Project Info */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-semibold text-[#222] border-b pb-2">Project Details</h3>

          {portfolio.excerpt && <p className="text-gray-600 border-l-4 border-[#7b7b7b] pl-3 italic">{portfolio.excerpt}</p>}

          {portfolio.link && (
            <div className="pt-4">
              <a
                href={portfolio.link.startsWith("http") ? portfolio.link : `https://${portfolio.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#222] hover:bg-[#7b7b7b] text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                Visit Project
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 bg-white rounded-2xl shadow-md p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#222]">About This Project</h2>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: portfolio.description }} />
      </div>

      {/* Project Gallery */}
      {images.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-6 text-[#222] text-center sm:text-left">Project Gallery</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-transform duration-300 cursor-pointer"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              >
                <img src={img.src} alt={portfolio.title} className="w-full h-36 sm:h-44 md:h-48 lg:h-52 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {open && <Lightbox open={open} close={() => setOpen(false)} index={index} slides={images} plugins={[Thumbnails, Captions]} />}
        </div>
      )}
    </section>
  );
}
