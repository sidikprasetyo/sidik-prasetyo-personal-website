"use client";

import Link from "next/link";
import { VscGithub } from "react-icons/vsc";
import { LiaLinkedin } from "react-icons/lia";

export default function Footer() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const subject = encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_SUBJECT || "");
  const body = encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_BODY || "");

  const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <footer className="bg-[#222222] pt-10 pb-6" data-aos="fade-up">
      <div className="max-w-4xl lg:max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-0 text-center md:text-left" data-aos="zoom-in">
        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-6 font-medium items-center">
          <Link href="#hero" className="font-manrope text-[#f8f8f8] hover:bg-[#383838] px-3 py-2 rounded-full transition">
            Home
          </Link>
          <Link href="#about" className="font-manrope text-[#f8f8f8] hover:bg-[#383838] px-3 py-2 rounded-full transition">
            About Me
          </Link>
          <Link href="#portfolio" className="font-manrope text-[#f8f8f8] hover:bg-[#383838] px-3 py-2 rounded-full transition">
            Portfolio
          </Link>
          <Link href="#services" className="font-manrope text-[#f8f8f8] hover:bg-[#383838] px-3 py-2 rounded-full transition">
            Services
          </Link>
        </div>

        {/* Divider */}
        <div className="md:hidden w-[90%] mx-auto h-px bg-[#383838] -my-6"></div>

        <div className="flex flex-col items-center md:items-end space-y-3">
          <Link href={mailto} className="text-2xl lg:text-3xl font-manrope text-[#f8f8f8] hover:text-[#7b7b7b] transition break-all">
            sidikprasetyo6661@gmail.com
          </Link>
          <div className="flex gap-3 justify-center md:justify-end items-center text-[#f8f8f8] mt-2">
            <Link href="https://github.com/sidikprasetyo" target="_blank" rel="noopener noreferrer" className="hover:text-[#7b7b7b] transition">
              <VscGithub size={24} />
            </Link>
            <Link href="https://www.linkedin.com/in/sidik-prasetyo/" target="_blank" rel="noopener noreferrer" className="text-[#f8f8f8] hover:text-[#7b7b7b] transition">
              <LiaLinkedin size={28} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
