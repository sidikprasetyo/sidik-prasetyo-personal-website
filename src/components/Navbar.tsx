"use client";

import Link from "next/link";
import { LuMenu, LuMoveUpRight, LuX } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.2;
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const subject = encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_SUBJECT || "");
  const body = encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_BODY || "");

  const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <nav className={`sticky top-1 z-50 transition-all duration-500 mx-2 md:mx-10 lg:mx-auto max-w-6xl ${scrolled ? "bg-white/25 backdrop-blur-md border border-gray-300 rounded-2xl md:rounded-full shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-2  flex items-center justify-between">
        {/* Menu */}
        <div className="hidden md:flex gap-6 font-medium items-center text-[#222222]">
          <Link href="#hero" className="me-8 font-montserrat text-xl bg-[#f3f3f3] px-2 py-2 rounded-full transition">
            SP
          </Link>
          <Link href="#about" className="font-manrope hover:text-[#7b7b7b] transition">
            About Me
          </Link>
          <Link href="#portfolio" className="font-manrope hover:text-[#7b7b7b] transition">
            Portfolio
          </Link>
          <Link href="#services" className="font-manrope hover:text-[#7b7b7b] transition">
            Services
          </Link>
        </div>

        {/* Button */}
        <Link href={mailto} className="hidden md:inline font-medium font-manrope text-[#222222] hover:text-[#7b7b7b] transition underline underline-offset-4">
          Get's in Touch
          <LuMoveUpRight className="inline-block" />
        </Link>

        {/* Hamburger Menu (Mobile & Tablet) */}
        <Link href="#hero" className="inline sm:hidden me-8 font-montserrat text-xl bg-[#f3f3f3] px-2 py-2 rounded-full" onClick={() => setIsMenuOpen(false)}>
          SP
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#222] focus:outline-none">
          {isMenuOpen ? <LuX size={26} /> : <LuMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 ease-in-out transform ${isMenuOpen ? "opacity-100 max-h-80 animate-slideFadeDown" : "opacity-0 max-h-0 overflow-hidden"}`}>
        <div className="flex flex-col items-center gap-4 py-5 text-[#222] bg-white/70 backdrop-blur-md rounded-2xl mx-4 mt-2 shadow-md mb-4">
          <Link href="#about" onClick={() => setIsMenuOpen(false)}>
            About Me
          </Link>
          <Link href="#portfolio" onClick={() => setIsMenuOpen(false)}>
            Portfolio
          </Link>
          <Link href="#services" onClick={() => setIsMenuOpen(false)}>
            Services
          </Link>
          <Link href={mailto} onClick={() => setIsMenuOpen(false)} className="font-medium underline underline-offset-4">
            Get's in Touch <LuMoveUpRight className="inline-block" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
