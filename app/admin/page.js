'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const revenueData = [
  { month: 'Ene', aov: 450, cltv: 1200 },
  { month: 'Feb', aov: 520, cltv: 1350 },
  { month: 'Mar', aov: 480, cltv: 1400 },
  { month: 'Abr', aov: 610, cltv: 1600 }
];

const velocityData = [
  { item: 'Anillos', diasBodega: 15 },
  { item: 'Collares', diasBodega: 32 },
  { item: 'Pulseras', diasBodega: 45 },
  { item: 'Brazaletes', diasBodega: 22 },
];

export default function AnalyticsDashboard() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Panel Analítico</h1>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '3rem' }}>Visón global de métricas clave y comportamiento de compra.</p>

      {/* Top Value Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="panel-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Promedio (AOV)</div>
          <div style={{ color: 'var(--primary)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>$515k</div>
          <div style={{ color: '#00d084', fontSize: '0.75rem', marginTop: '0.5rem' }}>↑ 12% vs. mes anterior</div>
        </div>
        <div className="panel-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drop-off Checkout</div>
          <div style={{ color: 'var(--on-surface)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>24%</div>
          <div style={{ color: '#ff6b6b', fontSize: '0.75rem', marginTop: '0.5rem' }}>Sticker Shock Detectado</div>
        </div>
        <div className="panel-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rotación Inventario</div>
          <div style={{ color: 'var(--on-surface)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>2.5x</div>
          <div style={{ color: '#00d084', fontSize: '0.75rem', marginTop: '0.5rem' }}>Velocidad Saludable</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'reaptea(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Trend LTV and AOV */}
        <div className="panel-elevated" style={{ padding: '2rem', width: '100%', overflowX: 'auto' }}>
           <h3 style={{ fontSize: '1rem', color: 'var(--on-surface)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Crecimiento de Valor (AOV vs CLTV)</h3>
           <div style={{ width: '100%', height: 300, minWidth: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-container)', border: '1px solid var(--outline)', borderRadius: 0 }} />
                <Line type="monotone" dataKey="cltv" name="Lifetime Value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="aov" name="Ticket Promedio" stroke="var(--on-surface)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* Inventory Velocity */}
        <div className="panel-elevated" style={{ padding: '2rem', width: '100%', overflowX: 'auto' }}>
           <h3 style={{ fontSize: '1rem', color: 'var(--on-surface)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Velocidad Estancamiento (Días en Bodega)</h3>
           <div style={{ width: '100%', height: 300, minWidth: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis dataKey="item" stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-container)', border: '1px solid var(--outline)', borderRadius: 0, color: 'var(--on-surface)' }} itemStyle={{ color: 'var(--on-surface)'}} cursor={{fill: 'var(--surface-high)'}} />
                <Bar dataKey="diasBodega" name="Días sin vender" fill="var(--outline-variant)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  )
}
