export const METALS = [
  { id: 'oro-amarillo-18k', name: 'Oro 18K Amarillo', gradient: ['#D4AF37', '#F5D060', '#B8941E'], price: 1200000, preview: '#D4AF37', pbr: '#FFE29B' },
  { id: 'oro-amarillo-24k', name: 'Oro 24K Puro', gradient: ['#F3BD12', '#FAD460', '#C49600'], price: 1800000, preview: '#F3BD12', pbr: '#FFDE8B' },
  { id: 'oro-blanco', name: 'Oro 18K Blanco (Rodio)', gradient: ['#E2E7E1', '#F1F2F1', '#A8A8A8'], price: 1200000, preview: '#E2E7E1', pbr: '#F1F2F1' },
  { id: 'oro-blanco-nat', name: 'Oro 18K Blanco (Natural)', gradient: ['#C8B898', '#D4C8B0', '#9E8D6B'], price: 1200000, preview: '#C8B898', pbr: '#D4C8B0' },
  { id: 'oro-rosa', name: 'Oro 18K Rosa', gradient: ['#B76E79', '#E8A0A0', '#8A424D'], price: 1200000, preview: '#B76E79', pbr: '#FAD0C0' },
  { id: 'platino', name: 'Platino 950', gradient: ['#A0A0A0', '#D5D0C8', '#707070'], price: 2500000, preview: '#D5D0C8', pbr: '#D5D0C8' },
  { id: 'plata-925', name: 'Plata 925', gradient: ['#8E8E8E', '#E2E5E6', '#707070'], price: 0, preview: '#A0A0A0', pbr: '#FCFAF5' },
  { id: 'paladio', name: 'Paladio 950', gradient: ['#909296', '#B5B6B9', '#65676B'], price: 1900000, preview: '#A8A9AD', pbr: '#B5B6B9' }
]

export const BAND_PROFILES = [
  { id: 'comfort-fit', name: 'Media Caña (Comfort-fit)' },
  { id: 'plano', name: 'Plano Moderno' },
  { id: 'knife-edge', name: 'Cuchillo (Knife-Edge)' },
  { id: 'd-shape', name: 'Tradicional D-Shape' }
]

export const BAND_FINISHES = [
  { id: 'pulido', name: 'Pulido Espejo' },
  { id: 'satinado', name: 'Satinado Mate' },
  { id: 'martillado', name: 'Martillado Artesanal' },
  { id: 'sandblasted', name: 'Sandblasted' }
]

export const SETTINGS = [
  { id: 'solitario-4', name: 'Solitario Clásico (4 Garras)', desc: 'Máxima luz para la gema', price: 0, icon: '💍' },
  { id: 'solitario-6', name: 'Estilo Tiffany (6 Garras)', desc: 'Máxima seguridad y simetría', price: 150000, icon: '💍' },
  { id: 'garras-dobles', name: 'Garras Dobles', desc: '8 puntas gemelas retro', price: 200000, icon: '🌟' },
  { id: 'cintillo', name: 'Cintillo (Pavé Estándar)', desc: 'Diamantes a lo largo del aro', price: 500000, icon: '✨' },
  { id: 'micro-pave', name: 'Micro-Pavé', desc: 'Gemas tipo polvo de estrellas', price: 700000, icon: '✨' },
  { id: 'halo', name: 'Halo Simple', desc: 'Corona rodeada de micro-brillantes', price: 800000, icon: '🌟' },
  { id: 'halo-oculto', name: 'Halo Oculto (Hidden Halo)', desc: 'Brillo secreto bajo la corona', price: 900000, icon: '🌟' },
  { id: 'bisel', name: 'Bisel Completo', desc: 'Marco continuo ultra seguro', price: 300000, icon: '🛡️' },
  { id: 'bisel-parcial', name: 'Bisel Parcial', desc: 'Soporte moderno a dos lados', price: 250000, icon: '🛡️' },
  { id: 'flush', name: 'Engaste al Ras (Gypsy)', desc: 'Minimalista y empotrado', price: 350000, icon: '⚪' },
  { id: 'tension', name: 'Tensión Suspensa', desc: 'Gema suspendida en el aire', price: 600000, icon: '⚡' },
  { id: 'catedral', name: 'Montura Catedral', desc: 'Arcos que elevan la corona', price: 400000, icon: '🏛️' },
]

export const GEMS = [
  { id: 'diamante', name: 'Diamante Natural', color: '#FFFFFF', sparkle: '#E8F4FD', inner: '#D0E8F5', pricePerCt: 4500000, icon: '💎', details: 'RI 2.42 | Brillo frío e incisivo' },
  { id: 'esmeralda', name: 'Esmeralda', color: '#046307', sparkle: '#0A8F0E', inner: '#034D06', pricePerCt: 1500000, icon: '💚', details: 'Con red interior de "jardín"' },
  { id: 'rubi', name: 'Rubí Sangre de Paloma', color: '#9B111E', sparkle: '#FF3355', inner: '#6B0F1A', pricePerCt: 3500000, icon: '❤️', details: 'Halo UV fluorescente y seda' },
  { id: 'zafiro', name: 'Zafiro Azul Aciano', color: '#0F52BA', sparkle: '#1E6FDB', inner: '#0A3A82', pricePerCt: 2500000, icon: '💙', details: 'Azul sedoso profundo' },
  { id: 'moissanita', name: 'Moissanita (Lab)', color: '#F0F5F8', sparkle: '#FFFFFF', inner: '#E8E8E8', pricePerCt: 400000, icon: '✨', details: 'Doble refracción y fuego extremo' },
  { id: 'zirconia', name: 'Zirconia Cúbica', color: '#F5F5F5', sparkle: '#FFFFFF', inner: '#E0E0E0', pricePerCt: 0, fixedPrice: 100000, icon: '🤍', details: 'Perfección sintética cristalina' },
  { id: 'morganita', name: 'Morganita', color: '#F8B5A3', sparkle: '#FFC8B8', inner: '#E29B87', pricePerCt: 300000, icon: '🌸', details: 'Rosa melocotón romántico' },
  { id: 'aquamarina', name: 'Aquamarina', color: '#80DEEA', sparkle: '#B2EBF2', inner: '#4DD0E1', pricePerCt: 600000, icon: '🧊', details: 'Azul helado cristalino' },
  { id: 'tanzanita', name: 'Tanzanita', color: '#6A3E9A', sparkle: '#8E24AA', inner: '#4A148C', pricePerCt: 1200000, icon: '🌌', details: 'Pleocroísmo exótico' },
]

export const GEM_SHAPES = [
  { id: 'brillante', name: 'Brillante (Redondo)' },
  { id: 'princesa', name: 'Princesa (Cuadrado)' },
  { id: 'ovalo', name: 'Óvalo' },
  { id: 'gota', name: 'Pera (Gota)' },
  { id: 'esmeralda', name: 'Esmeralda (Step-cut)' },
  { id: 'asscher', name: 'Asscher (Vintage X)' },
  { id: 'cushion', name: 'Cojín (Cushion)' },
  { id: 'marquesa', name: 'Marquesa' },
  { id: 'rosa', name: 'Corte Rosa (Vintage plana)' },
]

export const SIZES = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
export const CARAT_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]
export const WIDTH_OPTIONS = [1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0]
