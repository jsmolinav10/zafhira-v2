export const metadata = {
  title: '¿Qué es el Kilataje del Oro? (18K vs 14K) | Zafhira Bogotá',
  description: 'Guía completa sobre el kilataje del oro. Descubre por qué en Zafhira utilizamos exclusivamente Oro 18K para garantizar la máxima calidad en tus joyas personalizadas.',
};

export default function KilatajeGuia() {
  return (
    <article style={{ padding: '4rem 8%', maxWidth: '800px', margin: '0 auto', color: 'var(--on-surface)' }}>
      <h1 className="text-display font-serif" style={{ marginBottom: '2rem' }}>El Kilataje del Oro: ¿Qué significa y por qué es tan importante?</h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Cuando buscas un anillo de compromiso o una joya para toda la vida, uno de los términos más comunes que escucharás es el "kilataje" o los "quilates" del oro (se representa con la letra K). Como joyero experto en Bogotá, frecuentemente mis clientes me preguntan: <em>¿Qué significa realmente y cuál debería elegir?</em>
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>1. La regla del 24: El Oro Puro</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          El oro puro en su estado natural es de <strong>24 Kilates (24K)</strong>. Esto significa que de 24 partes posibles, las 24 son de oro. Sin embargo, el oro 24K tiene un problema fundamental: <strong>es extremadamente blando</strong>. Si hiciéramos un anillo de 24K, se deformaría con un simple apretón de manos y las piedras preciosas se caerían fácilmente.
        </p>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>2. La solución de la orfebrería: Las Aleaciones</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Para hacer que el oro sea resistente y duradero para el uso diario, los joyeros lo mezclamos (hacemos una "aleación") con otros metales fuertes como la plata, el cobre o el paladio. 
        </p>
        <ul style={{ marginBottom: '1.5rem', paddingLeft: '2rem' }}>
          <li><strong>Oro 14K:</strong> Tiene 14 partes de oro y 10 de otros metales (58.3% de pureza). Es muy resistente pero su color es menos intenso.</li>
          <li><strong>Oro 18K:</strong> Tiene 18 partes de oro y 6 de otros metales (75% de pureza). Es el equilibrio perfecto.</li>
        </ul>

        <h2 className="text-headline font-serif" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>3. Por qué en Zafhira trabajamos exclusivamente con Oro 18K</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          En nuestro taller en Bogotá, garantizamos el estándar de alta joyería europea. El <strong>Oro 18 Kilates</strong> ofrece el balance perfecto y superior:
        </p>
        <ol style={{ marginBottom: '1.5rem', paddingLeft: '2rem' }}>
          <li><strong>Color Superior:</strong> Al tener un 75% de oro puro, mantiene un color amarillo rico, cálido y lujoso que no se logra con el 14K.</li>
          <li><strong>Hipoalergénico:</strong> Al tener menos metales aleados, es mucho menos probable que cause alergias en la piel.</li>
          <li><strong>Durabilidad:</strong> Tiene la resistencia perfecta para sostener diamantes y piedras preciosas de forma segura por generaciones.</li>
          <li><strong>Valor de Inversión:</strong> Su alto contenido de oro puro hace que la joya retenga un mayor valor económico con el tiempo.</li>
        </ol>

        <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'var(--surface-container)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--gold)' }}>¿Listo para diseñar tu joya en Oro 18K?</h3>
          <p style={{ marginBottom: '1.5rem' }}>Hablemos sobre tu idea y transformémosla en una realidad inolvidable.</p>
          <a href="https://wa.me/573115425532?text=Hola%20Jhoan,%20leí%20la%20guía%20sobre%20oro%2018K%20y%20quiero%20cotizar%20una%20joya" target="_blank" rel="noopener noreferrer" className="btn-primary">Contactar por WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
