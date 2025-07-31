import React from 'react';
import { Carousel as BCarousel, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';

export interface CarouselSlide {
  id: string | number;
  src: string;        // URL de la imagen
  alt: string;        // texto alternativo
  caption?: string;   // título (opcional)
  description?: string; // texto debajo del título (opcional)
  link?: string;      // URL al hacer clic en la imagen (opcional)
}

interface Props {
  slides: CarouselSlide[];
  height?: string | number; // altura fija del carrusel (por defecto 400px)
  indicators?: boolean;
  controls?: boolean;
  fade?: boolean;
}

const Carousel: React.FC<Props> = ({
  slides,
  height = 400,
  indicators = true,
  controls = true,
  fade = false,
}) => {
  const handleWatchNow = (slide: CarouselSlide) => {
    Swal.fire({
      title: slide.caption,
      html: `
        <p class="text-white">${slide.description}</p>
      `,
      imageUrl: slide.src,
      imageAlt: slide.alt,
      background: '#000',
      showCancelButton: true,
      confirmButtonText: 'Ver ahora',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      customClass: {
        title: 'text-white',
        popup: 'border-2 border-red-600',
      },
    }).then((result) => {
      if (result.isConfirmed && slide.link) {
        window.location.href = slide.link;
      }
    });
  };

  return (
    <BCarousel
      fade={fade}
      indicators={indicators}
      controls={controls}
      style={{ height: `${height}px` }}
      className="modern-carousel shadow-lg"
    >
      {slides.map((s) => (
        <BCarousel.Item key={s.id} className="h-100">
          <Image
            src={s.src}
            alt={s.alt}
            fluid
            style={{ width: '100%', height, objectFit: 'cover', transition: 'transform 0.3s ease-in-out' }}
            onClick={() => handleWatchNow(s)}
            className={`${s.link ? 'cursor-pointer' : ''} hover-zoom`}
          />
          {(s.caption || s.description) && (
            <BCarousel.Caption>
              <h3 className="text-4xl font-bold">{s.caption}</h3>
              <p className="text-lg">{s.description}</p>
            </BCarousel.Caption>
          )}
        </BCarousel.Item>
      ))}
    </BCarousel>
  );
};

export default Carousel;
