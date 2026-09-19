'use client'

import { useState, useEffect } from 'react'

export default function PriceCalculator({ defaultCost = '', defaultMargin = '40', defaultPrice = '', onPriceChange }) {
  const [cost, setCost] = useState(defaultCost ? String(defaultCost) : '')
  const [margin, setMargin] = useState(defaultMargin ? String(defaultMargin) : '40')
  const [price, setPrice] = useState(defaultPrice ? String(defaultPrice) : '')
  const [isManualPrice, setIsManualPrice] = useState(!!defaultPrice && !!defaultCost)

  useEffect(() => {
    if (cost && margin && !isManualPrice) {
      const costNum = parseFloat(cost)
      const marginNum = parseFloat(margin)
      if (!isNaN(costNum) && !isNaN(marginNum) && costNum > 0) {
        const suggested = Math.round(costNum * (1 + marginNum / 100))
        setPrice(String(suggested))
        if (onPriceChange) onPriceChange(suggested)
      }
    }
  }, [cost, margin, isManualPrice])

  const costNum = parseFloat(cost) || 0
  const priceNum = parseFloat(price) || 0
  const actualMargin = costNum > 0 ? ((priceNum - costNum) / costNum) * 100 : 0
  const targetMargin = parseFloat(margin) || 0
  const netProfit = priceNum - costNum

  let marginColor = '#51cf66'
  let marginLabel = 'Saludable'
  if (actualMargin < 15) {
    marginColor = '#ff4444'
    marginLabel = 'Peligroso'
  } else if (actualMargin < 30) {
    marginColor = '#ffa94d'
    marginLabel = 'Ajustado'
  }

  const showWarning = priceNum > 0 && costNum > 0 && actualMargin < targetMargin

  const labelStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--on-surface-variant)',
    display: 'block',
    marginBottom: '4px'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    background: 'var(--surface-container)',
    border: '1px solid var(--outline-variant)',
    color: 'var(--on-surface)'
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Costo de Taller (COP)</label>
          <input
            name="production_cost"
            type="number"
            value={cost}
            onChange={(e) => { setCost(e.target.value); setIsManualPrice(false) }}
            placeholder="Ej. 467500"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>% Ganancia Deseada</label>
          <input
            name="profit_margin_target"
            type="number"
            value={margin}
            onChange={(e) => { setMargin(e.target.value); setIsManualPrice(false) }}
            placeholder="40"
            min="0"
            max="500"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>
          Precio de Venta (COP)
          {costNum > 0 && !isManualPrice && (
            <span style={{ color: 'var(--primary)', fontStyle: 'italic', textTransform: 'none', marginLeft: '8px' }}>
              — Calculado al {margin}%
            </span>
          )}
        </label>
        <input
          name="price"
          type="number"
          required
          value={price}
          onChange={(e) => {
            setPrice(e.target.value)
            setIsManualPrice(true)
            if (onPriceChange) onPriceChange(parseFloat(e.target.value))
          }}
          placeholder="1500000"
          style={{ ...inputStyle, borderColor: showWarning ? '#ff4444' : 'var(--outline-variant)' }}
        />
      </div>

      {costNum > 0 && priceNum > 0 && (
        <div style={{
          padding: '12px 16px',
          background: showWarning ? 'rgba(255,68,68,0.08)' : 'rgba(81,207,102,0.06)',
          border: `1px solid ${showWarning ? 'rgba(255,68,68,0.3)' : 'rgba(81,207,102,0.2)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: marginColor,
              boxShadow: `0 0 6px ${marginColor}`
            }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--on-surface)', fontWeight: 600 }}>
              Margen: {actualMargin.toFixed(1)}% ({marginLabel})
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            Ganancia: ${netProfit.toLocaleString('es-CO')}
          </span>
        </div>
      )}

      {showWarning && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(255,68,68,0.1)',
          border: '1px solid rgba(255,68,68,0.3)',
          color: '#ff6b6b',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span>
            <strong>Alerta:</strong> El precio asignado deja un margen de {actualMargin.toFixed(1)}%,
            por debajo del objetivo mínimo de {targetMargin}%. Revisa el precio antes de guardar.
          </span>
        </div>
      )}
    </>
  )
}
