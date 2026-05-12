export const metadata = {
  title: 'Tipos de Anillos de Compromiso y Cómo Elegir el Ideal | Zafhira Bogotá',
  description: 'Descubre los diferentes estilos de anillos de compromiso (Solitario, Halo, Tres Piedras, Vintage) y cómo elegir el diseño perfecto en Oro 18K para tu pareja.',
};

export default function TiposAnillosCompromiso() {
  return (
    <article style={{ padding: '4rem 8%', maxWidth: '800px', margin: '0 auto', color: 'var(--on-surface)' }}>
      <h1 className="text-display font-serif" style={{ marginBottom: '2rem' }}>Tipos de Anillos de Compromiso: ¿Cuál es el diseño perfecto para ella?</h1>
      
      <div style={{ width: '100%', height: '400px', marginBottom: '3rem', borderRadius: '8px', overflow: 'hidden' }}>
        <img src="/assets/guias/anillos_estilos_guia.png" alt="Estilos de Anillos de Compromiso" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          El anillo de compromiso es la promesa material de un amor eterno. En nuestro taller de joyería en Bogotá, vemos a diario cómo un diseño acertado puede emocionar hasta las lágrimas. A continuación, te explico los estilos más emblemáticos para que tomes la mejor decisión.
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>1. El Solitario (El Clásico Atemporal)</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Es el diseño más icónico y purista. Consiste en una banda de metal (preferiblemente Oro 18K) coronada por una única piedra preciosa central. 
          <br/><strong>Ideal para:</strong> Mujeres de estilo elegante, tradicional y minimalista. Es perfecto porque toda la atención se centra en la gema.
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>2. El Halo (Brillo Multiplicado)</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          En este diseño, la piedra central está rodeada por un "halo" de diamantes o gemas más pequeñas. Esta ilusión óptica hace que la piedra principal luzca hasta un medio quilate más grande y deslumbrante.
          <br/><strong>Ideal para:</strong> Mujeres que aman el glamour, el brillo intenso y buscan un anillo que destaque desde cualquier ángulo.
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>3. Tres Piedras (Pasado, Presente y Futuro)</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Cuenta con una gema central grande flanqueada por dos piedras ligeramente más pequeñas a los lados. Tradicionalmente, simbolizan la historia de la pareja: el pasado que construyeron, el presente que viven y el futuro que prometen.
          <br/><strong>Ideal para:</strong> Parejas con una fuerte conexión emocional y mujeres a las que les gustan las joyas con significado profundo.
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>4. Estilo Vintage o Art Déco</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Inspirados en épocas pasadas, estos anillos tienen detalles intrincados en el metal, grabados artesanales o filigrana. Son verdaderas obras de arte que parecen reliquias familiares.
          <br/><strong>Ideal para:</strong> Mujeres románticas, amantes del arte, la historia y que prefieren accesorios completamente únicos (nada producido en masa).
        </p>

        <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'var(--surface-container)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--gold)' }}>¿Aún no sabes cuál elegir?</h3>
          <p style={{ marginBottom: '1.5rem' }}>En Zafhira diseñamos el anillo desde cero, adaptándonos a su personalidad y tu presupuesto. Escríbeme y te asesoro personalmente.</p>
          <a href="https://wa.me/573115425532?text=Hola%20Jhoan,%20quiero%20diseñar%20un%20anillo%20de%20compromiso" target="_blank" rel="noopener noreferrer" className="btn-primary">Asesoría por WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
