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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-mobile-clip"
        style={{
          backgroundImage: "url('/images/hero-tienda.jpg')",
          filter: "brightness(0.6) saturate(1.1) contrast(1.1)"
        }}
      />
      
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/5 hero-mobile-clip"
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
