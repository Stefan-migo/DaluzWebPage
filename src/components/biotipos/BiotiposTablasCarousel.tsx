"use client";

import { useEffect, useRef, useState } from "react";
import TablaBiotipo, { type TablaBiotipoProps } from "./TablaBiotipo";

const AUTOPLAY_MS = 8000;
const SWIPE_THRESHOLD = 50;

const ArrowLeftSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85.24 105.19" aria-hidden="true">
    <path
      d="M83.93,0C66,16.18,46.83,30.93,27.42,45.22c-6.47,4.75-13,9.4-19.58,14L7.63,50.9C30.94,65.48,54.19,80.94,76,97.75c2.67,2.08,6.72,5.26,9.29,7.44-3.11-1.3-7.66-3.6-10.77-5.07C49.81,88,25.69,73.89,2.34,59.38A5,5,0,0,1,2.12,51C8.71,46.47,15.33,41.93,22,37.49,42.12,24.18,62.57,11.24,83.93,0Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowRightSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85.24 105.19" aria-hidden="true">
    <path
      d="M1.32,105.19C19.22,89,38.41,74.26,57.82,60c6.47-4.75,13-9.4,19.58-14l.21,8.33C54.3,39.71,31.05,24.25,9.29,7.44,6.62,5.37,2.57,2.18,0,0,3.11,1.3,7.67,3.6,10.77,5.07,35.43,17.2,59.55,31.3,82.9,45.81a5,5,0,0,1,.22,8.34c-6.59,4.57-13.21,9.11-19.9,13.55C43.12,81,22.67,94,1.32,105.19Z"
      fill="currentColor"
    />
  </svg>
);

type BiotiposTablasCarouselProps = {
  tablas: TablaBiotipoProps[];
};

export default function BiotiposTablasCarousel({ tablas }: BiotiposTablasCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = tablas.length;

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

  return (
    <div
      className="biotipos-tablas-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="biotipos-tablas-carousel-viewport">
        <div
          className="biotipos-tablas-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {tablas.map((tabla, idx) => (
            <div
              key={`${tabla.title}-${idx}`}
              className="biotipos-tablas-carousel-slide"
              aria-roledescription="slide"
              aria-label={`${idx + 1} de ${total}: ${tabla.title}`}
            >
              <TablaBiotipo {...tabla} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Tabla anterior"
        className="biotipos-tablas-carousel-arrow biotipos-tablas-carousel-arrow-left"
      >
        <ArrowLeftSVG />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Tabla siguiente"
        className="biotipos-tablas-carousel-arrow biotipos-tablas-carousel-arrow-right"
      >
        <ArrowRightSVG />
      </button>

      <div className="biotipos-tablas-carousel-dots">
        {tablas.map((tabla, idx) => (
          <button
            key={`dot-${idx}`}
            type="button"
            onClick={() => goTo(idx)}
            aria-label={`Ir a ${tabla.title}`}
            aria-current={idx === currentIndex}
            className="biotipos-tablas-carousel-dot"
          >
            <span className="biotipos-tablas-carousel-dot-inner" />
          </button>
        ))}
      </div>
    </div>
  );
}
