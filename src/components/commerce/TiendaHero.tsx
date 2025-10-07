"use client";

import { cn } from "@/lib/utils";

interface TiendaHeroProps {
  className?: string;
}

export default function TiendaHero({ className }: TiendaHeroProps) {
  return (
    <div 
      className={cn(
        "relative h-[350px] md:h-[300px] lg:h-[400px] overflow-hidden",
        "flex items-center justify-center group",
        "bg-cover bg-center bg-no-repeat",
        className
      )}
    >
      {/* Background Image with Filter */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-tienda.jpg')",
          filter: "brightness(0.6) saturate(1.1) contrast(1.1)",
          clipPath: 'polygon(100% 0%, 0% 0% , 0.00% 99.96%, 1.25% 99.64%, 2.50% 99.01%, 3.75% 98.09%, 5.00% 96.90%, 6.25% 95.48%, 7.50% 93.89%, 8.75% 92.17%, 10.00% 90.38%, 11.25% 88.58%, 12.50% 86.83%, 13.75% 85.17%, 15.00% 83.68%, 16.25% 82.39%, 17.50% 81.35%, 18.75% 80.59%, 20.00% 80.13%, 21.25% 80.00%, 22.50% 80.19%, 23.75% 80.71%, 25.00% 81.52%, 26.25% 82.61%, 27.50% 83.94%, 28.75% 85.47%, 30.00% 87.14%, 31.25% 88.91%, 32.50% 90.71%, 33.75% 92.50%, 35.00% 94.19%, 36.25% 95.76%, 37.50% 97.13%, 38.75% 98.28%, 40.00% 99.15%, 41.25% 99.73%, 42.50% 99.99%, 43.75% 99.92%, 45.00% 99.53%, 46.25% 98.83%, 47.50% 97.85%, 48.75% 96.61%, 50.00% 95.15%, 51.25% 93.53%, 52.50% 91.79%, 53.75% 89.99%, 55.00% 88.19%, 56.25% 86.46%, 57.50% 84.83%, 58.75% 83.38%, 60.00% 82.14%, 61.25% 81.16%, 62.50% 80.46%, 63.75% 80.08%, 65.00% 80.02%, 66.25% 80.28%, 67.50% 80.86%, 68.75% 81.73%, 70.00% 82.88%, 71.25% 84.26%, 72.50% 85.82%, 73.75% 87.52%, 75.00% 89.30%, 76.25% 91.11%, 77.50% 92.87%, 78.75% 94.55%, 80.00% 96.07%, 81.25% 97.40%, 82.50% 98.49%, 83.75% 99.30%, 85.00% 99.81%, 86.25% 100.00%, 87.50% 99.86%, 88.75% 99.41%, 90.00% 98.64%, 91.25% 97.60%, 92.50% 96.31%, 93.75% 94.81%, 95.00% 93.16%, 96.25% 91.40%, 97.50% 89.60%, 98.75% 87.81%, 100.00% 86.09%)'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/5" 
        style={{
          clipPath: 'polygon(100% 0%, 0% 0% , 0.00% 99.96%, 1.25% 99.64%, 2.50% 99.01%, 3.75% 98.09%, 5.00% 96.90%, 6.25% 95.48%, 7.50% 93.89%, 8.75% 92.17%, 10.00% 90.38%, 11.25% 88.58%, 12.50% 86.83%, 13.75% 85.17%, 15.00% 83.68%, 16.25% 82.39%, 17.50% 81.35%, 18.75% 80.59%, 20.00% 80.13%, 21.25% 80.00%, 22.50% 80.19%, 23.75% 80.71%, 25.00% 81.52%, 26.25% 82.61%, 27.50% 83.94%, 28.75% 85.47%, 30.00% 87.14%, 31.25% 88.91%, 32.50% 90.71%, 33.75% 92.50%, 35.00% 94.19%, 36.25% 95.76%, 37.50% 97.13%, 38.75% 98.28%, 40.00% 99.15%, 41.25% 99.73%, 42.50% 99.99%, 43.75% 99.92%, 45.00% 99.53%, 46.25% 98.83%, 47.50% 97.85%, 48.75% 96.61%, 50.00% 95.15%, 51.25% 93.53%, 52.50% 91.79%, 53.75% 89.99%, 55.00% 88.19%, 56.25% 86.46%, 57.50% 84.83%, 58.75% 83.38%, 60.00% 82.14%, 61.25% 81.16%, 62.50% 80.46%, 63.75% 80.08%, 65.00% 80.02%, 66.25% 80.28%, 67.50% 80.86%, 68.75% 81.73%, 70.00% 82.88%, 71.25% 84.26%, 72.50% 85.82%, 73.75% 87.52%, 75.00% 89.30%, 76.25% 91.11%, 77.50% 92.87%, 78.75% 94.55%, 80.00% 96.07%, 81.25% 97.40%, 82.50% 98.49%, 83.75% 99.30%, 85.00% 99.81%, 86.25% 100.00%, 87.50% 99.86%, 88.75% 99.41%, 90.00% 98.64%, 91.25% 97.60%, 92.50% 96.31%, 93.75% 94.81%, 95.00% 93.16%, 96.25% 91.40%, 97.50% 89.60%, 98.75% 87.81%, 100.00% 86.09%)'
        }}  
      />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
      </div>
      
      {/* Content - Higher z-index to be above filter */}
      <div className="relative z-20 text-center px-4">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-none tracking-wider drop-shadow-2xl text-white mb-6 group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-700 group-hover:text-yellow-100"
          style={{
            fontFamily: 'VELISTA, var(--font-velista), serif',
            fontWeight: 'normal',
            fontStyle: 'normal'
          }}
        >
          Tienda
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl text-white font-body max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          style={{
            fontFamily: 'malisha, var(--font-malisha), cursive',
            fontWeight: 'normal',
            fontStyle: 'normal',
            letterSpacing: '1.25px'
          }}
        >
          Descubre nuestra colección completa de biocosmética artesanal
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-16 h-16 opacity-10">
        <div className="w-full h-full bg-azul-profundo rounded-full animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 w-12 h-12 opacity-10">
        <div className="w-full h-full bg-dorado rounded-full animate-pulse delay-1000" />
      </div>
    </div>
  );
}
