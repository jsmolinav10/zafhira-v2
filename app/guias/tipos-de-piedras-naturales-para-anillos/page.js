export const metadata = {
  title: 'Tipos de Piedras Naturales para Anillos | Zafhira Bogotá',
  description: 'Conoce las alternativas al diamante para tu anillo personalizado. Zafiros, Esmeraldas y Rubíes: significado, dureza y por qué elegirlas.',
};

export default function PiedrasNaturales() {
  return (
    <article style={{ padding: '4rem 8%', maxWidth: '800px', margin: '0 auto', color: 'var(--on-surface)' }}>
      <h1 className="text-display font-serif" style={{ marginBottom: '2rem' }}>Más allá del diamante: Las mejores piedras naturales para tu anillo</h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Aunque el diamante es la opción tradicional, cada vez más mujeres prefieren anillos de compromiso y joyería personalizada con piedras naturales llenas de color y significado. En Zafhira, seleccionamos cuidadosamente gemas que no solo sean hermosas, sino lo suficientemente duraderas para el uso diario.
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>La importancia de la Dureza (Escala de Mohs)</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Antes de elegir una piedra, debemos hablar de la <strong>Escala de Mohs</strong>, que mide la resistencia a los rayones (del 1 al 10). Para un anillo que se usa todos los días, recomendamos piedras con dureza superior a 7.5. El diamante es un 10 perfecto.
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Las 3 Reinas del Color</h2>
        <ul style={{ marginBottom: '1.5rem', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <li>
            <strong>1. El Zafiro (Dureza 9):</strong> Es la piedra preciosa de color más resistente. Aunque es famoso por su azul profundo y aristocrático (como el de la Princesa Diana), existe en rosa, amarillo y blanco. Representa la lealtad y la sinceridad.
          </li>
          <li>
            <strong>2. El Rubí (Dureza 9):</strong> Hermano geológico del zafiro, el rubí destaca por su vibrante color rojo sangre. Es el símbolo universal de la pasión, el amor intenso y el coraje. Ideal para mujeres audaces.
          </li>
          <li>
            <strong>3. La Esmeralda (Dureza 7.5 - 8):</strong> En Colombia tenemos el privilegio de tener las mejores esmeraldas del mundo. Su verde hipnótico simboliza el renacimiento, la esperanza y la fertilidad. Requiere un poco más de cuidado al usarla, pero su belleza es incomparable.
          </li>
        </ul>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Alternativas Brillantes</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Si buscas el brillo cristalino del diamante pero con una propuesta diferente, la <strong>Moissanita</strong> (Dureza 9.25) es espectacular. Nació en los meteoritos y tiene incluso más fuego (destellos de colores) que el diamante tradicional.
        </p>

        <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'var(--surface-container)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--gold)' }}>Encuentra la piedra perfecta</h3>
          <p style={{ marginBottom: '1.5rem' }}>En nuestro taller te ayudamos a buscar, seleccionar y engastar la gema ideal para tu pieza personalizada.</p>
          <a href="https://wa.me/573115425532?text=Hola%20Jhoan,%20quiero%20conocer%20las%20opciones%20de%20piedras%20naturales" target="_blank" rel="noopener noreferrer" className="btn-primary">Cotizar Gema por WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
