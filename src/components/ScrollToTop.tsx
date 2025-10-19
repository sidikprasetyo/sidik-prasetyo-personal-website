"use client";

import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 750) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-[#222222] text-[#f8f8f8] shadow-lg hover:bg-[#383838] transition-all duration-300"
        >
          <IoIosArrowUp size={30} />
        </button>
      )}
    </>
  );
}
