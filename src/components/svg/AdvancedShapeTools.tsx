'use client';

import React from 'react';

// 🎨 ADVANCED SHAPE CREATION TOOLS

// 1. Procedural Wave Generator
export const ProceduralWaveGenerator: React.FC<{
  width?: number;
  height?: number;
  amplitude?: number;
  frequency?: number;
  phases?: number;
  colors?: string[];
  className?: string;
}> = ({
  width = 1920,
  height = 1080,
  amplitude = 200,
  frequency = 0.003,
  phases = 3,
  colors = ['#F0EACE', '#AE0000'],
  className = ""
}) => {
  
  const generateWavePath = (yOffset: number, amp: number, freq: number) => {
    let path = `M0,${height}`;
    
    for (let x = 0; x <= width; x += 10) {
      const y = yOffset + Math.sin(x * freq) * amp + Math.sin(x * freq * 2.1) * (amp * 0.3);
      path += ` L${x},${Math.max(0, Math.min(height, y))}`;
    }
    
    path += ` L${width},${height} L0,${height} Z`;
    return path;
  };

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            {colors.map((color, index) => (
              <stop
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="100%" height="100%" fill={colors[0]} />
        
        {/* Generate multiple wave layers */}
        {Array.from({ length: phases }, (_, i) => (
          <path
            key={i}
            d={generateWavePath(
              height * 0.6 + (i * 50),
              amplitude * (1 - i * 0.2),
              frequency * (1 + i * 0.3)
            )}
            fill={i === phases - 1 ? 'url(#wave-gradient)' : colors[1]}
            opacity={1 - (i * 0.2)}
          />
        ))}
      </svg>
    </div>
  );
};

// 2. Morphing Shape System
export const MorphingShapeBackground: React.FC<{
  shapes: string[];
  colors: string[];
  morphDuration?: string;
  className?: string;
}> = ({
  shapes,
  colors,
  morphDuration = '8s',
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <svg viewBox="0 0 1920 1080" className="w-full h-full">
        <defs>
          <style>
            {`
              @keyframes morph {
                ${shapes.map((_, index) => `
                  ${(index * 100) / shapes.length}% {
                    d: path('${shapes[index]}');
                  }
                `).join('')}
              }
              
              .morphing-path {
                animation: morph ${morphDuration} ease-in-out infinite;
              }
            `}
          </style>
          <linearGradient id="morph-gradient">
            {colors.map((color, index) => (
              <stop
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill={colors[0]} />
        <path
          className="morphing-path"
          d={shapes[0]}
          fill="url(#morph-gradient)"
        />
      </svg>
    </div>
  );
};

// 3. Particle Background System
export const ParticleBackground: React.FC<{
  particleCount?: number;
  colors?: string[];
  shapes?: Array<'circle' | 'square' | 'triangle'>;
  animation?: 'float' | 'pulse' | 'rotate';
  className?: string;
}> = ({
  particleCount = 50,
  colors = ['#F0EACE', '#AE0000'],
  shapes = ['circle'],
  animation = 'float',
  className = ""
}) => {
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    delay: Math.random() * 5
  }));

  const renderParticle = (particle: typeof particles[0]) => {
    const commonProps = {
      key: particle.id,
      cx: shapes.includes('circle') ? `${particle.x}%` : undefined,
      cy: shapes.includes('circle') ? `${particle.y}%` : undefined,
      x: !shapes.includes('circle') ? `${particle.x}%` : undefined,
      y: !shapes.includes('circle') ? `${particle.y}%` : undefined,
      fill: particle.color,
      opacity: 0.6,
      style: {
        animationDelay: `${particle.delay}s`,
        transformOrigin: 'center'
      }
    };

    switch (particle.shape) {
      case 'circle':
        return <circle {...commonProps} r={particle.size / 2} />;
      case 'square':
        return (
          <rect
            {...commonProps}
            width={particle.size}
            height={particle.size}
            rx={particle.size * 0.1}
          />
        );
      case 'triangle':
        return (
          <polygon
            {...commonProps}
            points={`${particle.size/2},0 ${particle.size},${particle.size} 0,${particle.size}`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <style>
        {`
          .particle-${animation} {
            animation: particle-${animation} 6s ease-in-out infinite;
          }
          
          @keyframes particle-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes particle-pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.5); opacity: 1; }
          }
          
          @keyframes particle-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <svg viewBox="0 0 1920 1080" className="w-full h-full">
        <g className={`particle-${animation}`}>
          {particles.map(renderParticle)}
        </g>
      </svg>
    </div>
  );
};

// 4. CSS-Based Advanced Shapes
export const CSSAdvancedShapes: React.FC<{
  shape: 'blob' | 'diamond' | 'hexagon' | 'star' | 'organic';
  colors: string[];
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'center' | 'bottom';
  className?: string;
}> = ({
  shape,
  colors,
  size = 'medium',
  position = 'center',
  className = ""
}) => {
  
  const getShapeStyles = () => {
    const baseSize = size === 'small' ? '300px' : size === 'medium' ? '600px' : '900px';
    
    const positions = {
      top: { top: '0', transform: 'translateY(-50%)' },
      center: { top: '50%', transform: 'translateY(-50%)' },
      bottom: { bottom: '0', transform: 'translateY(50%)' }
    };
    
    const shapes = {
      blob: {
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: `linear-gradient(45deg, ${colors.join(', ')})`,
        width: baseSize,
        height: baseSize
      },
      diamond: {
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        background: `conic-gradient(${colors.join(', ')})`,
        width: baseSize,
        height: baseSize
      },
      hexagon: {
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        background: `linear-gradient(120deg, ${colors.join(', ')})`,
        width: baseSize,
        height: baseSize
      },
      star: {
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        background: `radial-gradient(circle, ${colors.join(', ')})`,
        width: baseSize,
        height: baseSize
      },
      organic: {
        borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
        background: `conic-gradient(from 180deg, ${colors.join(', ')})`,
        width: baseSize,
        height: baseSize,
        filter: 'blur(1px)'
      }
    };
    
    return {
      ...positions[position],
      ...shapes[shape],
      position: 'absolute' as const,
      left: '50%',
      marginLeft: `-${parseInt(baseSize) / 2}px`,
      opacity: 0.8,
      mixBlendMode: 'multiply' as const
    };
  };

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <div style={getShapeStyles()} />
    </div>
  );
};

// 5. Interactive Background Builder
export const InteractiveBackgroundBuilder: React.FC<{
  config: {
    layers: Array<{
      type: 'wave' | 'particle' | 'shape' | 'gradient';
      props: any;
    }>;
  };
  className?: string;
}> = ({ config, className = "" }) => {
  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      {config.layers.map((layer, index) => {
        switch (layer.type) {
          case 'wave':
            return <ProceduralWaveGenerator key={index} {...layer.props} />;
          case 'particle':
            return <ParticleBackground key={index} {...layer.props} />;
          case 'shape':
            return <CSSAdvancedShapes key={index} {...layer.props} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
