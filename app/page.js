"use client";

import { useCart } from "../context/CartContext";

export default function Home() {
  const { addToCart } = useCart();

  const handleAddRing = () => {
    addToCart({
      id: "ring_001",
      name: "Anillo Sello de Autor (Oro 18K)",
      price: 1250000
    });
    alert("Anillo añadido a la colección VIP.");
  };

  const handleAddNecklace = () => {
    addToCart({
      id: "neck_002",
      name: "Cadena Ref703-042 Singapur 1MM 45CM",
      price: 89400
    });
    alert("Cadena añadida a la colección VIP.");
  };

  const handleAddDije = () => {
    addToCart({
      id: "dije_001",
      name: "Prueba Dije",
      price: 1500000
    });
    alert("Dije añadido a la colección VIP.");
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <h1 style={{ fontFamily: 'Noto Serif, serif', fontSize: '4rem', marginBottom: '1rem', color: 'var(--primary-gold)' }}>
        La Bóveda de Zafhira
      </h1>
      <p style={{ maxWidth: '600px', fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>
        Joyas con alma, creadas para perdurar en el tiempo. Bienvenido a nuestra exclusiva galería digital.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Product 1 */}
        <div className="panel-soft" style={{ width: '300px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ height: '300px', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span style={{ color: 'var(--text-muted)' }}>[💍 Foto Anillo]</span>
          </div>
          <h3 style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.4rem' }}>Anillo Sello de Autor</h3>
          <p style={{ color: 'var(--primary-gold)', fontSize: '1.2rem' }}>$ 1.250.000 COP</p>
          <button className="btn-ghost" onClick={handleAddRing}>
            Añadir a la Colección
          </button>
        </div>

        {/* Product 2 */}
        <div className="panel-soft" style={{ width: '300px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ height: '300px', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span style={{ color: 'var(--text-muted)' }}>[⛓️ Foto Cadena]</span>
          </div>
          <h3 style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.4rem' }}>Cadena Singapur 1mm</h3>
          <p style={{ color: 'var(--primary-gold)', fontSize: '1.2rem' }}>$ 89.400 COP</p>
          <button className="btn-ghost" onClick={handleAddNecklace}>
            Añadir a la Colección
          </button>
        </div>

        {/* Product 3: Dije Prueba */}
        <div className="panel-soft" style={{ width: '300px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ height: '300px', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
             {/* Using standard img assuming user copies "prueba.jpg" to public dir, fallback is text if not found */}
             <img 
               src="/prueba%20dije.jpg" 
               alt="Prueba Dije" 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
             />
             <span style={{ color: 'var(--text-muted)', display: 'none' }}>[🖼️ Coloca prueba.jpg en public/]</span>
          </div>
          <h3 style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.4rem' }}>Prueba Dije</h3>
          <p style={{ color: 'var(--primary-gold)', fontSize: '1.2rem' }}>$ 1.500.000 COP</p>
          <button className="btn-ghost" onClick={handleAddDije}>
            Añadir a la Colección
          </button>
        </div>

      </div>

      <a href="/checkout" className="btn-gold" style={{ marginTop: '4rem', textDecoration: 'none', display: 'inline-block' }}>
        IR AL CHECKOUT
      </a>
    </div>
  );
}
