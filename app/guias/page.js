import Link from 'next/link';

export const metadata = {
  title: 'Guías de Joyería por Jhoan Sebastian | Zafhira Bogotá',
  description: 'Aprende todo sobre joyería fina: tipos de anillos de compromiso, kilataje del oro, piedras preciosas y más. Taller de joyería en Bogotá.',
};

export default function GuiasPage() {
  return (
    <div style={{ padding: '4rem 8%', maxWidth: '1000px', margin: '0 auto', color: 'var(--on-surface)' }}>
      <h1 className="text-display font-serif" style={{ marginBottom: '1rem' }}>Guías y Consejos de Joyería</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--on-surface-variant)' }}>
        Todo lo que necesitas saber antes de invertir en una joya que durará toda la vida, explicado por Jhoan Sebastian.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <article style={{ padding: '2rem', border: '1px solid var(--outline)', borderRadius: '8px' }}>
          <h2 className="text-headline font-serif">Tipos de anillos de compromiso y cómo elegir el ideal</h2>
          <p style={{ marginTop: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Descubre la diferencia entre un anillo solitario, halo, vintage o tres piedras. 
            Te ayudamos a encontrar el diseño perfecto que cuente tu historia de amor.
          </p>
          <Link href="/guias/tipos-de-anillos-de-compromiso" className="btn-tertiary">Leer guía completa</Link>
        </article>

        <article style={{ padding: '2rem', border: '1px solid var(--outline)', borderRadius: '8px' }}>
          <h2 className="text-headline font-serif">¿Qué significa el kilataje del Oro (18K, 14K, 24K) y cuál elegir?</h2>
          <p style={{ marginTop: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            El oro puro es demasiado blando para la joyería diaria. Aprende por qué el Oro 18K 
            es el estándar de excelencia mundial y cómo identificar su pureza.
          </p>
          <Link href="/guias/kilataje-del-oro-y-su-importancia" className="btn-tertiary">Leer guía completa</Link>
        </article>

        <article style={{ padding: '2rem', border: '1px solid var(--outline)', borderRadius: '8px' }}>
          <h2 className="text-headline font-serif">Las mejores piedras naturales para un anillo personalizado</h2>
          <p style={{ marginTop: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Conoce las alternativas para salir de lo tradicional. La resistencia en la escala de Mohs y 
            el significado detrás de regalar una piedra de color.
          </p>
          <Link href="/guias/tipos-de-piedras-naturales-para-anillos" className="btn-tertiary">Leer guía completa</Link>
        </article>

        <article style={{ padding: '2rem', border: '1px solid var(--outline)', borderRadius: '8px' }}>
          <h2 className="text-headline font-serif">Análisis Profundo: Diamante, Zafiro, Rubí y Esmeralda</h2>
          <p style={{ marginTop: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            La guía definitiva de los "cuatro grandes" de la alta joyería. Sus orígenes, 
            sus colores, lo que simbolizan y sobre todo, cómo cuidarlas para que pasen a la siguiente generación.
          </p>
          <Link href="/guias/guia-detallada-de-piedras-preciosas" className="btn-tertiary">Leer guía completa</Link>
        </article>
      </div>
    </div>
  );
}
