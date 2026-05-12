'use client'

import { useState } from 'react'

const subcategoriesMap = {
  'Anillos': [
    'Compromiso',
    'Matrimonio',
    '15 Años',
    'Oferta',
    'Casual'
  ],
  'Collares': [
    'Cadenas 18K',
    'Gargantillas',
    'Dijes',
    'Piedras Preciosas'
  ],
  'Brazaletes': [
    'Esclavas',
    'Pulseras Tenis',
    'Personalizados'
  ],
  'Aretes': [
    'Topos',
    'Argollas',
    'Largos',
    'Ear Cuffs'
  ]
}

export default function CategorySelector() {
  const [mainCategory, setMainCategory] = useState('Anillos')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div>
        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Categoría</label>
        <select 
          name="main_category" 
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
          style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}
        >
          <option value="Anillos">Anillos</option>
          <option value="Collares">Collares</option>
          <option value="Brazaletes">Brazaletes</option>
          <option value="Aretes">Aretes</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Subcategoría</label>
        <select 
          name="subcategory" 
          style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}
        >
          {subcategoriesMap[mainCategory].map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
