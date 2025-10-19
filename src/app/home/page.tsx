"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { LuMoveDown, LuMoveUpRight } from "react-icons/lu";
import { FaLaptopCode } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { PiArrowBendDoubleUpRightBold } from "react-icons/pi";
import { FaJs, FaNodeJs, FaPhp, FaWordpress, FaBootstrap, FaGitAlt, FaGithub, FaFigma } from "react-icons/fa";
import { SiTypescript, SiExpress, SiNextdotjs, SiMysql, SiMongodb, SiSupabase, SiFirebase, SiCodeigniter, SiTailwindcss, SiPostman, SiCplusplus, SiLaragon, SiArduino, SiHtml5, SiCss3, SiPython } from "react-icons/si";
import { GoDotFill } from "react-icons/go";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { supabase } from "@/lib/supabaseClient";

type Experience = {
  id: string;
  title: string;
  project_start: string;
  project_end?: string | null;
  description: string;
  techs: string[];
};

interface Portfolio {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  link: string;
  portfolio_images: { id: string; image_url: string }[];
}

export default function HomePage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const aboutRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const techIcons = [
    { icon: <FaJs className="text-yellow-500" size={45} />, name: "JavaScript" },
    { icon: <SiTypescript className="text-blue-600" size={45} />, name: "TypeScript" },
    { icon: <FaNodeJs className="text-green-600" size={45} />, name: "Node.js" },
    { icon: <SiExpress className="text-gray-700" size={45} />, name: "Express.js" },
    { icon: <SiNextdotjs className="text-black dark:text-white" size={45} />, name: "Next.js" },
    { icon: <SiMysql className="text-blue-500" size={45} />, name: "MySQL" },
    { icon: <SiMongodb className="text-green-500" size={45} />, name: "MongoDB" },
    { icon: <SiSupabase className="text-emerald-600" size={45} />, name: "Supabase" },
    { icon: <SiFirebase className="text-orange-500" size={45} />, name: "Firebase" },
    { icon: <FaWordpress className="text-blue-700" size={45} />, name: "WordPress" },
    { icon: <FaPhp className="text-indigo-500" size={45} />, name: "PHP" },
    { icon: <SiCodeigniter className="text-red-600" size={45} />, name: "CodeIgniter" },
    { icon: <SiTailwindcss className="text-cyan-500" size={45} />, name: "Tailwind CSS" },
    { icon: <FaBootstrap className="text-purple-600" size={45} />, name: "Bootstrap" },
    { icon: <FaGitAlt className="text-orange-600" size={45} />, name: "Git" },
    { icon: <FaGithub className="text-black dark:text-white" size={45} />, name: "GitHub" },
    { icon: <SiPostman className="text-orange-500" size={45} />, name: "Postman" },
    { icon: <FaFigma className="text-pink-500" size={45} />, name: "Figma" },
    { icon: <SiCplusplus className="text-blue-700" size={45} />, name: "C++" },
    { icon: <SiLaragon className="text-blue-500" size={45} />, name: "Laragon" },
    { icon: <SiArduino className="text-green-700" size={45} />, name: "Arduino" },
    { icon: <SiHtml5 className="text-orange-500" size={45} />, name: "HTML" },
    { icon: <SiCss3 className="text-blue-500" size={45} />, name: "CSS" },
    { icon: <SiPython className="text-yellow-500" size={45} />, name: "Python" },
  ];

  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));

  useEffect(() => {
    setYear(new Date().getFullYear());
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = [aboutRef, experienceRef, portfolioRef, servicesRef, contactRef];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const subject = encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_SUBJECT || "");
  const body = encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_BODY || "");

  const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const fetchExperiences = async () => {
    const { data, error } = await supabase.from("experiences").select(`id, title, project_start, project_end, description, experience_tech(tech_stacks(name))`).order("project_start", { ascending: false });

    if (!error && data) {
      const mapped = data.map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        project_start: exp.project_start,
        project_end: exp.project_end,
        description: exp.description,
        techs: exp.experience_tech.map((et: any) => et.tech_stacks.name),
      }));
      setExperiences(mapped);
    }
  };

  // fungsi helper untuk format
  const formatMonthYear = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short", // Jan, Feb, Mar
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    fetch("/api/portfolios")
      .then((res) => res.json())
      .then(setPortfolios)
      .catch(console.error);
  }, []);

  if (isLoading) {
    return <LoadingOverlay open={isLoading} />;
  }

  return (
    <div className="font-manrope bg-[#f3f3f3] text-[#222222]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="#hero" className="relative flex flex-col lg:flex-row min-h-[91vh] bg-[#f3f3f3] text-black px-6 md:px-8 lg:px-12">
        {/* Left vertical line with text */}
        <div className="hidden lg:flex absolute left-10 top-30 bottom-18 flex flex-col justify-between items-center text-gray-500 animate-fade-in-left animate-pulse-custom">
          {/* Role */}
          <span className="rotate-[-90deg] text-sm tracking-widest">Fullstack Developer</span>

          {/* Year */}
          <span className="text-sm rotate-[-90deg] text-sm tracking-widest">{year}</span>
        </div>

        {/* Vertical line - Hidden on mobile/tablet */}
        <div className="hidden lg:block absolute left-29 top-58 bottom-0 w-px h-88 bg-gray-300 animate-slide-in-bottom delay-300" />

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center relative lg:-top-10 lg:pl-50 md:pl-8 md:-top-15 pl-0 z-10">
          {/* Info numbers (optional) */}
          {/* <div className="flex gap-10 text-sm text-gray-500 mb-15 initial-hidden animate-fade-in-up delay-200">
            <div>
              <p className="text-5xl font-light text-[#222222]">+7</p>
              <p>Projects completed</p>
            </div>
            <div>
              <p className="text-5xl font-light text-[#222222]">+3</p>
              <p>Startups raised</p>
            </div>
          </div> */}

          {/* Mobile/Tablet: Role and Year at top */}
          <div className="lg:hidden flex justify-between items-center mb-6 md:mb-4 text-gray-500 text-xs md:text-sm tracking-widest -pt-20 md:pt-20">
            <span>Fullstack Developer</span>
            <div className="flex-1 h-px bg-gray-300 animate-slide-in-right delay-200 mx-2"></div>
            <span>{year}</span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-medium initial-hidden animate-fade-in-up delay-300 mb-4 md:mb-2 lg:mb-10 leading-tight">Hello</h1>
          <p className="text-[#222222] text-base md:text-lg lg:text-xl initial-hidden animate-fade-in-up delay-400 max-w-xl lg:max-w-lg mb-8 md:mb-0">— I&apos;m Sidik Prasetyo, bringing ideas to life through code and design.</p>
        </div>

        {/* Right photo - Dekstop */}
        <div className="hidden lg:flex flex-1 flex justify-center initial-hidden animate-fade-in-right delay-500">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <Image src="/heropic.png" alt="Profile" width={570} height={500} className="relative object-cover grayscale rounded-lg group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
          </div>
        </div>

        {/* Tablet: Photo di samping, lebih compact */}
        <div className="hidden md:flex lg:hidden flex-1 justify-center items-end initial-hidden animate-fade-in-right delay-500 pb-40">
          <div className="relative group w-full max-w-[400px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-t-lg blur opacity-25"></div>
            <img src="/heropic.png" alt="Profile" className="relative w-full h-auto object-cover object-top rounded-t-lg" />
          </div>
        </div>

        {/* Mobile: Photo lebih kecil dan centered */}
        <div className="md:hidden flex justify-center items-center initial-hidden animate-fade-in-up delay-400 mt-auto pb-20">
          <div className="relative group w-full max-w-[280px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-lg blur opacity-25"></div>
            <img src="/heropic.png" alt="Profile" className="relative w-full h-auto object-cover rounded-lg" />
          </div>
        </div>

        {/* Scroll down */}
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:left-50 lg:transform-none bottom-8 md:bottom-18 lg:bottom-17 lg:translate-x-1/2 flex flex-col items-center text-[#222222] initial-hidden animate-fade-in-up delay-500 z-20">
          <Link href="#about" className="flex items-center hover:text-gray-600 transition-colors">
            <span className="text-xs md:text-sm me-1">Scroll down</span>
            <LuMoveDown size={10} className="animate-bounce relative top-0.5" />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="flex flex-col md:flex-row lg:min-h-screen bg-[#f3f3f3] px-6 md:px-15 lg:px-20 text-[#222222] md:gap-4 lg:gap-0">
        {/* Kolom Kiri */}
        <div className="pt-12 md:py-30 lg:py-18 lg:px-6 max-w-6xl w-full md:w-[30%] lg:w-[37%] mx-auto text-center md:text-start" data-aos="fade-right">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">About Me</h2>
          <p className="text-base md:text-lg text-[#7b7b7b] leading-relaxed">
            I started coding out of curiosity, and it quickly became my way of creating. Today, I build seamless, scalable web applications — combining frontend creativity with backend precision to make ideas come alive.
          </p>
          <PiArrowBendDoubleUpRightBold className="hidden md:block rotate-[10deg] text-[#7b7b7b] opacity-15 md:mt-0 md:size-[150px] lg:mt-20 lg:size-[250px] mx-auto" />
        </div>

        {/* Kolom Tengah */}
        <div className="pt-2 md:py-30 lg:py-18 px-0 max-w-6xl w-full md:w-[30%] lg:w-[25%] mx-auto" data-aos="fade-up">
          <div className="max-w-6xl py-6 md:p-4 lg:p-6 mx-auto bg-[#fefefe] rounded-xl shadow-sm hover:shadow-md transition mt-2" data-aos="fade-up">
            <FaLaptopCode size={70} className="mb-5 text-[#222222] bg-[#fefefe] rounded-full p-3 shadow-sm shadow-[#222222] mx-auto md:mx-0" />
            <h1 className="text-xl md:text-2xl font-bold text-center md:text-start mb-3">Fullstack Developer</h1>
            <p className="text-base md:text-lg text-[#7b7b7b] text-center md:text-start leading-relaxed">I design and develop smooth, scalable, and modern web applications.</p>
            <Image src="/aboutpictwo.png" alt="Profile" width={300} height={300} className="object-cover rounded-lg mt-5 mx-auto" />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="pt-6 md:py-32 lg:py-20 lg:px-10 max-w-6xl w-full md:w-[30%] lg:w-[37%] mx-auto" data-aos="fade-left">
          <Image src="/aboutpicone.png" alt="Profile" width={250} height={250} className="hidden md:block mx-auto object-cover rounded-lg md:mb-5 lg:mb-10" />
          <div className="flex mb-5">
            <div className="mt-2 me-3 h-10 w-10 flex items-center justify-center bg-[#222222] text-[#ffffff] rounded-full p-3">
              <Sparkles size={24} />
            </div>
            <p className="text-lg text-[#7b7b7b]">Transforming ideas into seamless digital experiences.</p>
          </div>
          <div className="flex">
            <div className="mt-2 me-3 h-10 w-10 flex items-center justify-center bg-[#222222] text-[#ffffff] rounded-full p-3">
              <Sparkles size={24} />
            </div>
            <p className="text-lg text-[#7b7b7b]">Blending logic and design to build impactful products.</p>
          </div>
        </div>
      </section>
      <div className="max-w-full md:max-w-2xl lg:max-w-7xl mx-auto bg-[#f3f3f3] md:pb-5 lg:pb-10 mt-8 pb-5 md:-mt-20 lg:-mt-5" data-aos="fade-left">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {techIcons.map((tech, index) => (
              <CarouselItem key={index} className="basis-1/3 md:basis-1/6 lg:basis-1/8 flex justify-center">
                <div className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                  {tech.icon}
                  <span className="text-sm text-gray-600">{tech.name}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>
      </div>

      {/* Experience Section */}
      <section className="flex bg-[#fdfdfd] px-6 md:px-20 text-[#222222]">
        <div className="py-12 md:py-20 lg:px-6 mx-auto w-full bg-[#fdfdfd]">
          <div className="flex flex-row items-center justify-center md:justify-start mb-5 md:mb-8 lg:mb-10" data-aos="fade-up-right">
            <GoDotFill size={18} className="text-[#222222]" />
            <h2 className="text-sm font-medium">Experiences</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-8 lg:mb-10">
            <h1 className="text-3xl lg:text-5xl font-medium text-center md:text-start leading-tight md:w-2/4" data-aos="fade-up-right">
              Crafting innovation at the crossroads of Web <br className="hidden lg:block" /> and IoT.
            </h1>
            <div className="md:w-[45%] lg:w-[30%]" data-aos="fade-up-left">
              <p className="text-sm lg:text-base mb-3 text-[#7b7b7b] text-center md:text-start leading-relaxed">
                Let’s collaborate to transform your ideas into innovative web and IoT solutions. I design and build systems that blend creativity, logic, and real-world functionality — helping your vision become a seamless digital
                experience.
              </p>
              <Link href={mailto} className="flex justify-center items-center md:justify-start font-medium font-manrope text-[#222222] hover:text-[#7b7b7b] transition underline underline-offset-4">
                Get's in Touch
                <LuMoveUpRight className="inline-block" />
              </Link>
            </div>
          </div>

          <div className="space-y-8" data-aos="zoom-in">
            {experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-1 md:grid-cols-9 gap-4 md:gap-6 border-b border-gray-200 pb-6">
                {/* Judul & tanggal */}
                <div className="md:col-span-3">
                  <h3 className="text-lg md:text-xl font-semibold">{exp.title}</h3>
                  <span className="text-sm text-gray-500">
                    {formatMonthYear(exp.project_start)} - {formatMonthYear(exp.project_end || null)}
                  </span>
                </div>

                {/* Deskripsi */}
                <p className="md:col-span-4 text-[#7b7b7b] text-sm md:text-base leading-relaxed">{exp.description}</p>

                {/* Tech stack */}
                <div className="md:col-span-2 flex flex-wrap gap-2 items-start md:items-center justify-start md:justify-end">
                  {exp.techs.map((t) => (
                    <span key={t} className="px-3 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200 transition">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-[#ffffff] px-6 md:px-12 lg:px-20 pb-10 md:pb-15" data-aos="zoom-in">
        <div
          className="relative h-[350px] md:h-[400px] rounded-xl shadow overflow-hidden group"
          style={{
            backgroundImage: "url('/bgexp.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom", // ubah jadi "top" / "bottom" / "left" sesuai kebutuhan
          }}
        >
          {/* Overlay gelap */}
          <div className="absolute inset-0 bg-black/65"></div>

          {/* Konten */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-20 text-white space-y-4 text-center" data-aos="fade-up">
            <h4 className="text-xs md:text-sm font-light" data-aos="fade-in">
              (Let’s turn your ideas into action.)
            </h4>
            <h1 className="text-2xl md:text-4xl font-bold leading-snug" data-aos="fade-in">
              Let’s build something extraordinary together.
            </h1>
            <h4 className="text-xs md:text-sm font-light max-w-2xl mx-auto" data-aos="fade-in">
              Whether it’s a responsive web app or a smart IoT system, I turn ideas into meaningful digital experiences.
            </h4>
            <Link href={mailto} className="inline-flex items-center gap-2 font-medium font-manrope text-white hover:text-gray-300 transition underline underline-offset-4 mt-4">
              Let's Talk
              <LuMoveUpRight className="inline-block" />
            </Link>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <section id="portfolio" className="flex bg-[#f3f3f3] px-6 md:px-12 lg:px-20 text-[#222222]">
        <div className="py-16 md:py-20 bg-[#f3f3f3] mx-auto w-full">
          <div className="flex justify-center mb-5">
            <div className="inline-flex flex items-center bg-[#ffffff] py-1 px-3 rounded-full" data-aos="zoom-in">
              <GoDotFill size={18} className="text-[#222222]" />
              <h2 className="text-xs md:text-sm font-medium">Portfolio</h2>
            </div>
          </div>
          <div className="text-center mb-8" data-aos="zoom-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">Latest Works</h1>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" data-aos="fade-in">
            {portfolios
              ?.slice(-3) // ambil 3 item terakhir
              .reverse() // urutkan agar yang terbaru di atas
              .map((portfolio) => (
                <Link key={portfolio.id} href={`/portfolio/${portfolio.id}`} className="group relative transition-shadow duration-300" data-aos="flip-left">
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500">
                    {portfolio.portfolio_images?.[0] ? (
                      <img
                        src={portfolio.portfolio_images[0].image_url}
                        alt={portfolio.title}
                        className="w-full h-56 sm:h-60 object-cover rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-60 bg-gray-300 rounded-xl shadow-md flex items-center justify-center text-gray-600">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                  </div>

                  <HiArrowUpRight className="absolute top-4 right-4 text-gray-500 text-xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 group-hover:text-blue-500" />

                  <div className="mt-3">
                    <h3 className="text-base md:text-lg font-semibold text-[#222] group-hover:text-[#7b7b7b] transition-colors duration-300">{portfolio.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2 group-hover:text-[#7b7b7b] transition-colors duration-300">{portfolio.excerpt}</p>
                  </div>
                </Link>
              ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-8">
            <span className="text-sm font-medium text-[#7b7b7b]">Check out More</span>
            <HiOutlineArrowNarrowRight size={20} className="mx-2 rotate-90 md:rotate-0" />
            <Link href="/portfolio" className="text-sm font-semibold text-[#222222] hover:underline">
              View More
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="flex bg-[#f3f3f3] px-6 sm:px-10 md:px-16 lg:px-20 pb-20 text-[#222222]">
        <div className="bg-[#f3f3f3] mx-auto w-full" data-aos="fade-in">
          {/* Title */}
          <div className="flex justify-center mb-5" data-aos="zoom-in">
            <div className="inline-flex items-center bg-[#ffffff] py-1 px-3 rounded-full">
              <GoDotFill size={20} className="text-[#222222]" />
              <h2 className="text-sm font-medium">Services</h2>
            </div>
          </div>
          <div className="text-center mb-10" data-aos="zoom-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium">What I Do</h1>
          </div>

          {/* Cards Grid */}
          <div className="w-full sm:w-[90%] md:w-[85%] w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10" data-aos="fade-in">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md transform transition-all duration-700 ease-in-out hover:shadow-xl focus:shadow-xl active:scale-[0.98] overflow-hidden group" data-aos="flip-left">
              <div className="relative overflow-hidden">
                <img src="/serviceone.jpg" alt="Project 1" className="w-full h-48 sm:h-56 md:h-60 object-cover rounded-b-xl transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/25 rounded-b-xl"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 group-hover:font-bold transition-colors duration-300">Web Development</h3>
                <p className="text-sm sm:text-base text-gray-600">I build modern, responsive, and high-performance websites using the latest technologies — ensuring seamless experiences across all devices.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md transform transition-all duration-700 ease-in-out hover:shadow-xl focus:shadow-xl active:scale-[0.98] overflow-hidden group" data-aos="flip-left">
              <div className="relative overflow-hidden">
                <img src="/servicetwo.jpg" alt="Project 2" className="w-full h-48 sm:h-56 md:h-60 object-cover rounded-b-xl transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/25 rounded-b-xl"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 group-hover:font-bold transition-colors duration-300">API & Backend Development</h3>
                <p className="text-sm sm:text-base text-gray-600">Designing and developing secure, scalable APIs and backend systems that power dynamic and data-driven applications.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md transform transition-all duration-700 ease-in-out hover:shadow-xl focus:shadow-xl active:scale-[0.98] overflow-hidden group" data-aos="flip-left">
              <div className="relative overflow-hidden">
                <img src="/servicethree.jpg" alt="Project 3" className="w-full h-48 sm:h-56 md:h-60 object-cover rounded-b-xl transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/25 rounded-b-xl"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 group-hover:font-bold transition-colors duration-300">IoT System Integration</h3>
                <p className="text-sm sm:text-base text-gray-600">Bridging the digital and physical worlds by connecting sensors, devices, and web platforms into smart, interactive systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 sm:px-10 md:px-20 lg:px-30 bg-[#eeeeee] text-[#222222] rounded-t-3xl mx-auto">
        <div className="relative z-10 py-16 px-4 sm:px-8 md:px-16 text-center space-y-6" data-aos="zoom-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight" data-aos="fade-in">
            Let’s Build Something Amazing Together.
          </h1>
          <h4 className="text-xs sm:text-sm md:text-base font-light mb-8 md:mb-12 text-gray-700" data-aos="fade-in">
            Ready to turn your ideas into a clean, modern, and functional website? <br className="hidden sm:block" /> Let’s collaborate and make it happen.
          </h4>
          <Link href={mailto} className="inline-flex items-center gap-2 font-medium font-manrope text-[#222222] hover:text-[#7b7b7b] transition underline underline-offset-4 text-sm sm:text-base" data-aos="fade-in">
            Let's Talk
            <LuMoveUpRight className="inline-block" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
