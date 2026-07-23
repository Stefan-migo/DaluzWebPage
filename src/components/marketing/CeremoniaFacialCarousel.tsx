"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  src: string;
  alt: string;
};

const BANNERS: Banner[] = [
  {
    src: "/images/ceremonias/carrusel/ceremonia-acne.webp",
    alt: "Ceremonia facial para piel con tendencia al acné: limpieza profunda y calma",
  },
  {
    src: "/images/ceremonias/carrusel/ceremonia-pitta.webp",
    alt: "Ceremonia facial para piel sensible / Pitta: alivio y protección",
  },
  {
    src: "/images/ceremonias/carrusel/ceremonia-mixta.webp",
    alt: "Ceremonia facial para piel mixta / Pitta-Kapha: hidratación y balance",
  },
  {
    src: "/images/ceremonias/carrusel/ceremonia-madura.webp",
    alt: "Ceremonia facial para piel madura / Vata: nutrición y regeneración",
  },
  {
    src: "/images/ceremonias/carrusel/ceremonia-grasa.webp",
    alt: "Ceremonia facial para piel grasa / Kapha: claridad y ligereza",
  },
  {
    src: "/images/ceremonias/carrusel/ceremonia-seca.webp",
    alt: "Ceremonia facial para piel seca / Vata: suavidad y nutrición",
  },
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function CeremoniaFacialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = BANNERS.length;

  const goTo = (index: number) => {
    setCurrentIndex(((index % total) + total) % total);
  };
  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  useEffect(() => {
    if (isPaused || total <= 1) return;
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
      className="relative -mx-4 overflow-hidden rounded-none shadow-2xl sm:mx-auto sm:max-w-[1600px] sm:rounded-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Ceremonias faciales según tu biotipo"
    >
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {BANNERS.map((banner, idx) => (
          <div key={banner.src} className="w-full flex-shrink-0">
            <Link
              href="/productos"
              className="block"
              aria-roledescription="slide"
              aria-label={`${idx + 1} de ${total}`}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                width={1400}
                height={422}
                sizes="(max-width: 1300px) 100vw, 1300px"
                priority={idx === 0}
                className="h-auto w-full"
              />
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
        aria-label="Ceremonia anterior"
        className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:left-4 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-5 w-5 text-white drop-shadow-lg sm:h-7 sm:w-7" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          stopBubble(e);
          goNext();
        }}
        aria-label="Ceremonia siguiente"
        className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:right-4 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-5 w-5 text-white drop-shadow-lg sm:h-7 sm:w-7" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-4 sm:gap-3">
        {BANNERS.map((banner, idx) => (
          <button
            key={`dot-${banner.src}`}
            type="button"
            onClick={(e) => {
              stopBubble(e);
              goTo(idx);
            }}
            aria-label={`Ir a la ceremonia ${idx + 1}`}
            aria-current={idx === currentIndex}
            className="group p-1.5"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${idx === currentIndex
                ? "h-2 w-6 bg-white sm:w-8"
                : "h-2 w-2 bg-white/50 group-hover:bg-white/80"
                }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
