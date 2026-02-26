'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Procesos Pages - Reusable SVG & Layout Components
 * Used by: /servicios/procesos, ciclos-alquimicos, sesiones-integrales
 */

/* ===========================
   PROCESOS HEADER TITLE CONTAINER
   Wraps the title - wavy header style is in BgwithHeader.webp background
   =========================== */
export const ProcesosHeaderTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`procesos-header-title-container ${className}`}>
      {children}
    </div>
  );
};

/* ===========================
   PROCESOS BACKGROUND
   Uses: BgwithHeader.webp (default) or BgGeneral.webp (variant, repeats vertically)
   =========================== */
export const ProcesosBackground: React.FC<{
  className?: string;
  variant?: 'default' | 'general';
}> = ({ className = '', variant = 'default' }) => {
  if (variant === 'general') {
    return (
      <div
        className={`procesos-page-bg procesos-bg-general ${className}`}
        aria-hidden
      />
    );
  }
  return (
    <div className={`procesos-page-bg ${className}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/svg/procesos/BgwithHeader.webp" alt="" className="procesos-bg-img" />
    </div>
  );
};

/* ===========================
   ORGANIC TEXT BOX (Wrapper)
   Use with procesos-organic-box class from CSS
   =========================== */
export const ProcesosOrganicBox: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`procesos-organic-box ${className}`}>
      {children}
    </div>
  );
};

/* ===========================
   OVAL TEXT BOX (for ciclos-alquimicos, etc.)
   Oval-shaped container for text content
   =========================== */
export const ProcesosOvalBox: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`procesos-oval-box ${className}`}>
      <div className="procesos-oval-box-inner">{children}</div>
    </div>
  );
};

/* ===========================
   OVAL IMAGE PLACEHOLDER
   Oval with slight rotation to the right (via CSS)
   =========================== */
export const ProcesosOvalPlaceholder: React.FC<{
  src?: string;
  alt?: string;
  className?: string;
}> = ({ src, alt = '', className = '' }) => {
  return (
    <div className={`procesos-oval-placeholder ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={480}
          height={360}
          className="w-full h-full object-cover"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 400px, 480px"
        />
      ) : (
        <div
          className="w-full h-full min-h-[120px] flex items-center justify-center bg-[var(--procesos-cream)]"
          aria-label="Placeholder de imagen"
        />
      )}
    </div>
  );
};
