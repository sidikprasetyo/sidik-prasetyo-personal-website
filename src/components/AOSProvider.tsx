"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 800, // durasi animasi
      once: true,    // animasi hanya jalan sekali
    });
  }, []);

  return null;
}
