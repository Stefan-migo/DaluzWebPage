'use client';

import { NextPage } from 'next';
import Image from 'next/image';

const AlkimyaPage: NextPage = () => {
  return (
    <div className="relative" style={{ minHeight: '200vh' }}>
      {/* Background Pattern */}
      <div className="absolute top-[-36rem] inset-0 z-0">
        {/* First Block - Normal */}
        <div className="absolute top-0 left-0 w-full h-[2160px]">
          {/* Layer 1: Background Pattern */}
          <div 
            className="absolute inset-0"
            style={{
              top: '-65rem',
              backgroundImage: 'url(/svg/bgMirrowed.svg)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center top'
            }}
          />
          {/* Layer 2: 01.svg */}
          <div 
            className="absolute inset-0"
            style={{
              top: '-65rem',
              backgroundImage: 'url(/svg/001.svg)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center top'
            }}
          />
        </div>
        
        {/* Second Block - Flipped Vertically */}
        <div 
          className="absolute top-[2160px] left-0 w-full h-[2160px]"
          style={{
            backgroundImage: 'url(/svg/bgMirrowed.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            transform: 'scaleY(-1)',
            top: '14.3rem',
          }}
        />
        
        {/* Third Block - Normal */}
        <div 
          className="absolute top-[4320px] left-0 w-full h-[2160px]"
          style={{
            backgroundImage: 'url(/svg/bgMirrowed.svg)',
            backgroundSize: '1920px 2160px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top'
          }}
        />
        
        {/* Fourth Block - Flipped Vertically */}
        <div 
          className="absolute top-[6480px] left-0 w-full h-[2160px]"
          style={{
            backgroundImage: 'url(/svg/bgMirrowed.svg)',
            backgroundSize: '1920px 2160px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            transform: 'scaleY(-1)'
          }}
        />
        
        {/* Additional blocks for very long pages */}
        <div 
          className="absolute top-[8640px] left-0 w-full h-[2160px]"
          style={{
            backgroundImage: 'url(/svg/bgMirrowed.svg)',
            backgroundSize: '1920px 2160px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top'
          }}
        />
        
        <div 
          className="absolute top-[10800px] left-0 w-full h-[2160px]"
          style={{
            backgroundImage: 'url(/svg/bgMirrowed.svg)',
            backgroundSize: '1920px 2160px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            transform: 'scaleY(-1)'
          }}
        />
      </div>

      {/* Third Layer: Text Content - Easily Positionable */}
      <div 
      className="absolute inset-0 z-20 pointer-events-none"
      style={{
        top: '-101rem',
      }}
      >
        
        {/* Text1: Main Title */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '3.5rem',
            left: '8rem',
            right: '8rem'
          }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-7xl font-bold text-line-primary font-velista tracking-wider drop-shadow-2xl">
            Alkimya Da Luz
          </h1>
        </div>

        {/* Text2: Secondary Title */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '16rem',
            left: '80px',
            right: '80px',
            textAlign: 'center'
          }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-3xl text-line-primary font-heading leading-relaxed drop-shadow-lg">
            <strong>Neurocosmética que Transforma:</strong> una fusión entre los saberes ancestrales y la química moderna.
          </h2>
        </div>

        {/* Text3: Subtitle */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '21.5rem',
            left: '100px',
            right: '100px',
            textAlign: 'center'
          }}
        >
          <h3 className="text-lg md:text-xl lg:text-1xl font-medium text-line-primary font-body leading-relaxed drop-shadow-md">
            Creada para quienes buscan ir más allá de la cosmética, deseando una experiencia de transformación genuina.
          </h3>
        </div>

        {/* Text4: First Paragraph */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '30.6rem',
            left: '12rem',
            right: '8rem'
          }}
        >
          <p className="text-base md:text-lg lg:text-xl text-line-primary font-body leading-relaxed drop-shadow-sm">
            Sabemos que la verdadera belleza radica en la armonía integral; por eso Inspirada en la sabiduría de las medicinas ancestrales que transformaron la conexión con mi cuerpo, he creado alquimias diversas con el sincero deseo de acompañarte a equilibrar no sólo la salud de tu piel, sino también la armonía de tus emociones y la claridad de tus pensamientos.
          </p>
        </div>

        {/* Text5: Second Paragraph */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '61rem',
            left: '41rem',
            right: '11rem',
            maxWidth: '43rem',
            textAlign: 'center'
          }}
        >
          <p className="text-base md:text-lg lg:text-xl text-line-primary font-body leading-relaxed drop-shadow-sm">
            Como la naturaleza misma, nuestros cuerpos hablan, y Da Luz es el puente para escucharlos, para que a través de cada aroma, cada toque, cada gota, y cada sonido puedas reconectar con lo más profundo de tu Ser.
          </p>
        </div>

        {/* Text6: Third Paragraph */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '84rem',
            left: '6rem',
            right: '2rem',
            maxWidth: '80rem',
            textAlign: 'center'
          }}
        >
          <p className="text-sm md:text-base lg:text-lg text-line-primary font-body leading-relaxed drop-shadow-sm">
            Nuestras fórmulas se elaboran con materias primas de alta calidad y libres de crueldad animal. Utilizamos aceites esenciales puros, aceites vegetales prensados en frío, hierbas medicinales, ácidos grasos, y otros activos cuidadosamente seleccionados, que honran la integridad de tu cuerpo y la vitalidad de nuestro ecosistema, conscientes de la influencia mutua de nuestras elecciones.
          </p>
        </div>

        {/* Text7: Fourth Paragraph */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '99.5rem',
            left: '6rem',
            right: '2rem',
            maxWidth: '84rem',
            textAlign: 'center'
          }}
        >
        <p className="text-base md:text-lg lg:text-xl text-line-primary font-body leading-relaxed drop-shadow-md font-medium">
            Te propongo algo mucho más allá de la belleza física, de tu equilibrio físico…
            Te propongo una conexión Alquimica con tu propio cuerpo,<br/>
            Tus sentidos y vos, una ceremonia de conexión.
          </p>
        </div>

      </div>

      {/* Fourth Layer: Image Content - Easily Positionable */}
      <div 
        className="absolute inset-0 z-25 pointer-events-none"
        style={{
          top: '-101rem',
        }}
      >
        {/* Image Layer */}
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: '53.5rem',
            left: '42%',
            transform: 'translateX(-121%)',
            width: '590px',
            height: '404px'
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              clipPath: 'ellipse(32% 49% at 50% 50%)',
              overflow: 'hidden'
            }}
          >
            <Image
              src="/images/alkimya/image.png"
              alt="Alkimya Da Luz - Meditative Practice"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
          </div>
        </div>

      </div>

      {/* Additional content to test scrolling */}
      <div className="relative z-30 mt-[1600px] p-8">
        <div className="container mx-auto">
          
          
        
        </div>
      </div>
    </div>
  );
};

export default AlkimyaPage;