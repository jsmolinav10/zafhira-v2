export const metadata = {
  title: 'Guía Detallada de Piedras Preciosas | Zafhira Bogotá',
  description: 'Un análisis profundo de los cuatro grandes de la joyería: Diamante, Zafiro, Rubí y Esmeralda. Aprende sus características, cuidados y cómo elegirlos.',
};

export default function GuiaDetalladaPiedras() {
  return (
    <article style={{ padding: '4rem 8%', maxWidth: '800px', margin: '0 auto', color: 'var(--on-surface)' }}>
      <h1 className="text-display font-serif" style={{ marginBottom: '2rem' }}>Guía Detallada: Las Cuatro Grandes Gemas de la Alta Joyería</h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          En el mundo de la alta joyería, existen cuatro gemas que históricamente han dominado por su rareza, belleza y prestigio. En el taller de Zafhira en Bogotá, trabajamos con estas maravillas de la naturaleza para crear piezas que se heredan de generación en generación. Aquí te presento una guía profunda de cada una.
        </p>

        {/* El Diamante */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="text-headline font-serif" style={{ marginBottom: '1rem', color: 'var(--gold)' }}>1. El Diamante: Luz Inconquistable</h2>
          <p style={{ marginBottom: '1rem' }}><strong>Dureza:</strong> 10/10 | <strong>Símbolo:</strong> Amor eterno, pureza, invencibilidad.</p>
          <p style={{ marginBottom: '1rem' }}>
            Formado a cientos de kilómetros bajo la superficie terrestre bajo presión extrema, el diamante es el material natural más duro conocido por el hombre. Su nombre proviene del griego <em>adamas</em> (invencible).
          </p>
          <p style={{ marginBottom: '1rem' }}><strong>Las 4 C's:</strong> Su valor se determina por su Corte (Cut), Color (Color), Claridad (Clarity) y Quilates (Carat). Un corte excelente es lo que le da ese "fuego" y brillo característico.</p>
          <p><strong>Cuidado:</strong> Puede limpiar diamantes con agua tibia, jabón suave y un cepillo de dientes suave. A pesar de ser duros, pueden astillarse si reciben un golpe directo y fuerte.</p>
        </section>

        {/* El Zafiro */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="text-headline font-serif" style={{ marginBottom: '1rem', color: '#1a4e8a' }}>2. El Zafiro: Nobleza y Sabiduría</h2>
          <p style={{ marginBottom: '1rem' }}><strong>Dureza:</strong> 9/10 | <strong>Símbolo:</strong> Verdad, lealtad, sabiduría y nobleza.</p>
          <p style={{ marginBottom: '1rem' }}>
            Perteneciente a la familia del Corindón, el zafiro azul es la piedra favorita de la realeza británica para los compromisos. Su color azul se debe a rastros de hierro y titanio.
          </p>
          <p><strong>Cuidado:</strong> Excelentes para el uso diario. Se pueden limpiar de la misma manera que los diamantes o con limpiadores ultrasónicos.</p>
        </section>

        {/* El Rubí */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="text-headline font-serif" style={{ marginBottom: '1rem', color: '#a3152a' }}>3. El Rubí: El Fuego del Rey</h2>
          <p style={{ marginBottom: '1rem' }}><strong>Dureza:</strong> 9/10 | <strong>Símbolo:</strong> Pasión, vitalidad, valor y prosperidad.</p>
          <p style={{ marginBottom: '1rem' }}>
            También es un Corindón, pero debe su intenso color rojo a la presencia de cromo. En las culturas asiáticas antiguas, era considerado el "Rey de las Piedras Preciosas". Encontrar un rubí grande y puro es extremadamente raro, a menudo más que un diamante.
          </p>
          <p><strong>Cuidado:</strong> Al igual que el zafiro, es muy resistente y no requiere cuidados extraordinarios más allá de una limpieza regular.</p>
        </section>

        {/* La Esmeralda */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="text-headline font-serif" style={{ marginBottom: '1rem', color: '#097969' }}>4. La Esmeralda: El Orgullo Colombiano</h2>
          <p style={{ marginBottom: '1rem' }}><strong>Dureza:</strong> 7.5 - 8/10 | <strong>Símbolo:</strong> Renacimiento, intuición y amor pacífico.</p>
          <p style={{ marginBottom: '1rem' }}>
            Perteneciente a la familia del Berilo, Colombia produce las esmeraldas de mayor calidad y color del mundo. Se caracterizan por su "jardín" interno, que son las inclusiones naturales que prueban su origen terrenal y hacen que cada piedra sea como una huella digital única.
          </p>
          <p><strong>Cuidado:</strong> ¡ATENCIÓN! Las esmeraldas son sensibles. NUNCA se deben limpiar en máquinas ultrasónicas o con vapor. Solo usar agua tibia y jabón muy suave. Proteger de cambios bruscos de temperatura.</p>
        </section>

        <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'var(--surface-container)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--gold)' }}>Seleccionamos la mejor gema para ti</h3>
          <p style={{ marginBottom: '1.5rem' }}>Como expertos, analizamos y certificamos cada piedra que usamos en nuestro taller para tu total tranquilidad.</p>
          <a href="https://wa.me/573115425532?text=Hola%20Jhoan,%20leí%20la%20guía%20de%20piedras%20preciosas%20y%20quiero%20hacer%20una%20consulta" target="_blank" rel="noopener noreferrer" className="btn-primary">Consultar con Jhoan Sebastian</a>
        </div>
      </div>
    </article>
  );
}
