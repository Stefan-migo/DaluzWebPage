"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Linea = {
  href: string;
  title: string;
  subtitle: string;
  bgColor: string;
  texture: string;
  textureOpacity: number;
  overlayGradient?: string;
  showDots?: boolean;
  image: string;
  imageAlt: string;
};

const LINEAS: Linea[] = [
  {
    href: "/categorias/linea-ecos",
    title: "LÍNEA ECOS",
    subtitle: "Limpieza Consciente: Purificación y Chakra Laríngeo.",
    bgColor: "#12406F",
    texture: "/images/textures/texture-ecos-ocean.jpg",
    textureOpacity: 0.4,
    overlayGradient:
      "linear-gradient(to bottom right, rgba(30, 58, 138, 0.5), rgba(30, 64, 175, 0.3), rgba(30, 58, 138, 0.5))",
    showDots: true,
    image: "/images/lineas/ecos/ecos-producto-1.jpg",
    imageAlt: "Línea ECOS - Producto 1",
  },
  {
    href: "/categorias/linea-umbral",
    title: "LÍNEA UMBRAL",
    subtitle: "Nutrición y Placer: Humectación y Chakra Sacro.",
    bgColor: "#EA4F12",
    texture: "/images/textures/texture-umbral-desert.jpg",
    textureOpacity: 0.4,
    overlayGradient:
      "linear-gradient(to bottom right, rgba(124, 45, 18, 0.5), rgba(153, 27, 27, 0.3), rgba(124, 45, 18, 0.5))",
    showDots: true,
    image: "/images/lineas/umbral/umbral-producto-1.jpg",
    imageAlt: "Línea UMBRAL - Producto 1",
  },
  {
    href: "/categorias/linea-jade-ritual",
    title: "LÍNEA JADE RITUAL",
    subtitle: "Elixires Botánicos: Equilibrio y Chakra Cardíaco.",
    bgColor: "#04412D",
    texture: "/images/textures/texture-jade-forest.jpg",
    textureOpacity: 0.3,
    image: "/images/lineas/jade-ritual/jade-producto-1.jpg",
    imageAlt: "Línea JADE RITUAL - Producto 1",
  },
  {
    href: "/categorias/linea-prisma",
    title: "LÍNEA PRISMA",
    subtitle: "Maquillaje Intencionado: Exploración y Chakra Plexo Solar.",
    bgColor: "#392E13",
    texture: "/images/textures/texture-utopica-golden.jpg",
    textureOpacity: 0.3,
    image: "/images/lineas/utopica/prisma-banner.png",
    imageAlt: "Línea PRISMA - Banner",
  },
  {
    href: "/categorias/linea-alma-terra",
    title: "LÍNEA ALMA TERRA",
    subtitle: "Aromaterapia y Conexión: Calma y Chakra Raíz.",
    bgColor: "#9B201A",
    texture: "/images/textures/texture-alma-terra-earth.jpg",
    textureOpacity: 0.3,
    image: "/images/lineas/alma-terra/alma-terra-producto-1.jpg",
    imageAlt: "Línea ALMA TERRA - Producto 1",
  },
];

const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD = 50;

export default function LineasCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = LINEAS.length;

  const goTo = (index: number) => {
    setCurrentIndex(((index % total) + total) % total);
  };
  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const stopBubble = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {LINEAS.map((linea, idx) => (
          <div key={linea.href} className="w-full flex-shrink-0">
            <Link href={linea.href} className="block group">
              <section
                className="relative py-8 md:py-12 px-6 overflow-hidden cursor-pointer"
                style={{ backgroundColor: linea.bgColor }}
                aria-roledescription="slide"
                aria-label={`${idx + 1} de ${total}: ${linea.title}`}
              >
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${linea.texture}')`,
                      opacity: linea.textureOpacity,
                      filter: "brightness(0.8)",
                    }}
                  />
                  {linea.overlayGradient && (
                    <div
                      className="absolute inset-0"
                      style={{ backgroundImage: linea.overlayGradient }}
                    />
                  )}
                  {linea.showDots && (
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 30% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)",
                          backgroundSize: "40px 40px",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="relative z-10 container mx-auto max-w-7xl">
                  <div className="text-center max-w-5xl mx-auto px-8 sm:px-12">
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-7 md:mb-8">
                      <h2 className="font-title text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl text-white leading-tight drop-shadow-2xl">
                        {linea.title}
                      </h2>
                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
                    </div>
                    <p className="text-sm sm:text-lg md:text-lg lg:text-xl xl:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                      {linea.subtitle}
                    </p>
                    <div className="flex justify-center items-center mt-6 sm:mt-7 md:mt-8">
                      <div
                        className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 card-enhanced shadow-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                        style={{ borderRadius: "0px 15px" }}
                      >
                        <Image
                          src={linea.image}
                          alt={linea.imageAlt}
                          width={192}
                          height={192}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: "0px 15px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Link>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={(e) => {
          stopBubble(e);
          goPrev();
        }}
        aria-label="Línea anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          stopBubble(e);
          goNext();
        }}
        aria-label="Línea siguiente"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
        {LINEAS.map((linea, idx) => (
          <button
            key={linea.href}
            type="button"
            onClick={(e) => {
              stopBubble(e);
              goTo(idx);
            }}
            aria-label={`Ir a ${linea.title}`}
            aria-current={idx === currentIndex}
            className="group p-2"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${idx === currentIndex
                ? "w-6 sm:w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/50 group-hover:bg-white/80"
                }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
