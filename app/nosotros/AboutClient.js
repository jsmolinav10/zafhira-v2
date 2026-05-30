'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

function isVideo(url) {
  if (!url) return false;
  return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov') || url.toLowerCase().endsWith('.webm');
}

export default function AboutClient({ galleryItems }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const galleryRef = useRef(null);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* SECCIÓN SOBRE NOSOTROS (FOUNDER) */}
      <section className="about-hero-section">
        {/* Usaremos un layout en CSS Grid */}
        <div className="founder-grid">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="founder-image-container"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{
              width: 'min(60vw, 350px)',
              aspectRatio: '1/1',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: '1px solid var(--outline-variant)'
            }}>
              <img 
                src="/assets/jhoan-founder.jpg" 
                alt="Jhoan Sebastián - Fundador de Zafhira" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="founder-text-container"
          >
            <h1 style={{ fontFamily: '"Noto Serif", Georgia, serif', fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Inmortalizamos Momentos
            </h1>
            
            <div style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <p>
                Soy <strong style={{color: 'var(--on-surface)'}}>Jhoan Sebastián</strong>, fundador y joyero de Zafhira. Me especializo en el diseño y fabricación de anillos personalizados en Bogotá, creando piezas únicas para compromisos, matrimonios, aniversarios, grados y cualquier ocasión especial. Trabajo de la mano con cada cliente para transformar sus ideas, emociones e historias en joyas exclusivas elaboradas a medida.
              </p>
              <p>
                En Zafhira trabajamos con oro, plata, diamantes, gemas preciosas y piedras semipreciosas cuidadosamente seleccionadas, garantizando acabados de alta calidad y una atención excepcional en cada detalle. Mi compromiso es crear piezas que no solo destaquen por su belleza, sino que también tengan un significado profundo y perduren a través del tiempo.
              </p>
              <p style={{ fontStyle: 'italic', color: 'var(--primary)', fontSize: '1.2rem', marginTop: '1rem', borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                "Porque en Zafhira, más que hacer joyas, inmortalizamos momentos."
              </p>
            </div>

            <button 
              onClick={scrollToGallery}
              className="btn-primary" 
              style={{ marginTop: '2.5rem' }}
            >
              CONOCE MIS TRABAJOS
            </button>
          </motion.div>

        </div>
      </section>

      {/* SEPARADOR ELEGANTE */}
      <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--outline-variant), transparent)', margin: '4rem 0' }} />

      {/* SECCIÓN GALERÍA INMERSIVA */}
      <section ref={galleryRef} style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 6% 8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h2 style={{ fontFamily: '"Noto Serif", Georgia, serif', fontSize: '2rem', color: 'var(--on-surface)', letterSpacing: '0.05em' }}>
             Galería de Trabajos Personalizados
           </h2>
           <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
             Obras a medida creadas junto a nuestros clientes. Cada joya cuenta una historia.
           </p>
        </div>

        {galleryItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Aún no hay trabajos publicados en la galería.
          </div>
        ) : (
          <div className="masonry-grid">
            {galleryItems.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                className="gallery-item-container"
              >
                {/* MARCO DORADO CLÁSICO (CUADRO) */}
                <div 
                  className="gallery-frame"
                  onClick={() => setSelectedItem(item)}
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.pause();
                  }}
                >
                  <div className="gallery-media-wrapper">
                    {isVideo(item.image_url) ? (
                      <video 
                        src={item.image_url} 
                        loop 
                        muted 
                        playsInline 
                        className="gallery-media"
                        /* Se eliminó autoPlay para reproducir solo en hover */
                      />
                    ) : (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="gallery-media"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Indicador de Video en Móvil */}
                    {isVideo(item.image_url) && (
                      <div className="video-indicator">
                        ▶ Reproducir Video
                      </div>
                    )}
                  </div>
                </div>

                {/* PLACA DE MUSEO (TÍTULO Y DESCRIPCIÓN) */}
                <div className="gallery-plaque">
                  <h3 className="plaque-title">{item.title}</h3>
                  <p className="plaque-desc">
                    {item.description 
                      ? (item.description.length > 120 ? item.description.substring(0, 120) + '...' : item.description)
                      : 'Una pieza única forjada artesanalmente para inmortalizar un momento especial.'}
                  </p>
                  <button className="plaque-btn" onClick={() => setSelectedItem(item)}>
                    LEER LA HISTORIA COMPLETA
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL DE HISTORIA (DETALLE DE LA JOYA) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gallery-modal-backdrop"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="gallery-modal-content"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="gallery-modal-close" 
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>

              <div className="gallery-modal-grid">
                <div className="gallery-modal-media">
                  {isVideo(selectedItem.image_url) ? (
                    <video 
                      src={selectedItem.image_url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
                    />
                  ) : (
                    <img 
                      src={selectedItem.image_url} 
                      alt={selectedItem.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'var(--surface-container)' }}
                    />
                  )}
                </div>
                
                <div className="gallery-modal-info">
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Trabajo Personalizado
                  </span>
                  <h3 style={{ fontFamily: '"Noto Serif", Georgia, serif', fontSize: '2rem', color: 'var(--on-surface)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedItem.title}
                  </h3>
                  
                  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', color: 'var(--on-surface-variant)', fontSize: '0.95rem', lineHeight: '1.8' }}>
                    {selectedItem.description ? (
                      selectedItem.description.split('\n').map((paragraph, i) => (
                        <p key={i} style={{ marginBottom: '1rem' }}>{paragraph}</p>
                      ))
                    ) : (
                      <p>Una pieza única forjada artesanalmente para inmortalizar un momento especial.</p>
                    )}
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                     <a 
                      href={`https://wa.me/573229007675?text=Hola,%20vi%20la%20pieza%20*${encodeURIComponent(selectedItem.title)}*%20en%20tu%20galer%C3%ADa%20y%20me%20gustar%C3%ADa%20cotizar%20algo%20similar.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ width: '100%', textAlign: 'center', display: 'block' }}
                     >
                       QUIERO ALGO SIMILAR
                     </a>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .about-hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16rem 6% 4rem; /* Padding superior enorme en móviles para esquivar el header fijo */
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .about-hero-section {
            padding: 10rem 6% 4rem; /* Padding normal en PC */
          }
        }

        .founder-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        @media (min-width: 992px) {
          .founder-grid {
            grid-template-columns: 1fr 1.2fr;
            gap: 6rem;
          }
        }

        .masonry-grid {
          display: grid;
          /* Reducido el tamaño mínimo en móviles para que no se vea gigante */
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 3rem 2rem;
          justify-content: center;
        }

        .gallery-item-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 360px; /* Evita que el video sea masivo en pantallas anchas sin columnas */
          margin: 0 auto;
        }

        /* --- MARCO DE CUADRO CLÁSICO (NIVEL MUSEO) --- */
        .gallery-frame {
          cursor: pointer;
          width: 100%;
          aspect-ratio: 4/5;
          position: relative;
          background: #0a0a0a;
          
          /* Marco Dorado Realista con Degradado */
          border: 18px solid #b8860b;
          border-image: linear-gradient(135deg, #fceabb 0%, #d4af37 25%, #8a6327 50%, #d4af37 75%, #fceabb 100%) 1;
          
          /* Capas del Marco (Borde exterior de madera, bisel interno oscuro y filo dorado) */
          box-shadow: 
            0 0 0 4px #3e2723, /* Marco exterior oscuro */
            inset 0 0 0 8px #1a1a1a, /* Bisel interior oscuro */
            inset 0 0 0 10px #d4af37, /* Filo dorado pegado al lienzo */
            inset 0 0 30px 15px rgba(0,0,0,0.9), /* Sombra profunda sobre el video/foto */
            0 25px 50px rgba(0,0,0,0.8); /* Sombra pesada del cuadro en la pared */
          
          padding: 10px; /* Espacio para el bisel */
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .gallery-frame:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 
            0 0 0 4px #3e2723,
            inset 0 0 0 8px #1a1a1a,
            inset 0 0 0 10px #d4af37,
            inset 0 0 25px 12px rgba(0,0,0,0.8),
            0 35px 60px rgba(0,0,0,0.9);
        }

        .gallery-media-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background: #000;
          border: 1px solid rgba(212, 175, 55, 0.4); /* Línea fina interna */
        }

        .gallery-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.5s ease;
        }

        .gallery-frame:hover .gallery-media {
          filter: brightness(1.1);
        }

        .video-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          color: var(--primary);
          padding: 8px 16px;
          border: 1px solid var(--primary);
          border-radius: 20px;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.3s;
        }

        .gallery-frame:hover .video-indicator {
          opacity: 0;
        }

        @media (hover: none) {
          .gallery-frame:active .video-indicator {
            opacity: 0;
          }
        }

        /* --- PLACA DE MUSEO INFERIOR --- */
        .gallery-plaque {
          margin-top: 1.5rem;
          text-align: center;
          padding: 0 1rem;
        }

        .plaque-title {
          font-family: '"Noto Serif", Georgia, serif';
          font-size: 1.25rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .plaque-desc {
          font-size: 0.85rem;
          color: var(--on-surface-variant);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .plaque-btn {
          background: none;
          border: none;
          border-bottom: 1px solid var(--primary);
          color: var(--on-surface);
          font-family: 'Manrope', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          padding-bottom: 4px;
          transition: color 0.3s ease;
        }

        .plaque-btn:hover {
          color: var(--primary);
        }

        /* --- MODAL --- */
        .gallery-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .gallery-modal-content {
          background: var(--surface);
          width: 100%;
          max-width: 1100px;
          height: 80vh;
          border-radius: 4px; /* Combinar con el estilo clásico */
          overflow: hidden;
          position: relative;
          box-shadow: 0 25px 50px rgba(0,0,0,0.8);
          border: 1px solid var(--primary);
        }

        .gallery-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0,0,0,0.5);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 200ms, border-color 200ms;
        }
        
        .gallery-modal-close:hover {
          background: var(--primary);
          border-color: var(--primary);
        }

        .gallery-modal-grid {
          display: grid;
          grid-template-columns: 1fr;
          height: 100%;
        }

        @media (min-width: 768px) {
          .gallery-modal-grid {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .gallery-modal-media {
          background: #000;
          height: 30vh;
        }

        @media (min-width: 768px) {
          .gallery-modal-media {
            height: 100%;
          }
        }

        .gallery-modal-info {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          height: 50vh;
        }

        @media (min-width: 768px) {
          .gallery-modal-info {
            height: 100%;
          }
        }
      `}</style>
    </div>
  )
}
