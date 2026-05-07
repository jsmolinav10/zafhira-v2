'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { createClient } from '@/lib/supabase/client'

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    aov: 0,
    orderCount: 0,
    productCount: 0,
    revenueData: [],
    inventoryData: []
  })

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      
      // 1. Fetch Orders for Sales and AOV
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total, created_at')
        .order('created_at', { ascending: true })

      // 2. Fetch Products for Inventory
      const { count: productCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (ordersError || productsError) {
        console.error('Error fetching dashboard stats:', ordersError || productsError)
        setLoading(false)
        return
      }

      // Process Sales Data
      const totalSales = orders.reduce((acc, order) => acc + (order.total || 0), 0)
      const orderCount = orders.length
      const aov = orderCount > 0 ? totalSales / orderCount : 0

      // Process Chart Data (Group by month)
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      const groupedData = orders.reduce((acc, order) => {
        const date = new Date(order.created_at)
        const month = months[date.getMonth()]
        if (!acc[month]) acc[month] = { month, total: 0, count: 0 }
        acc[month].total += order.total || 0
        acc[month].count += 1
        return acc
      }, {})

      const revenueData = Object.values(groupedData)

      setStats({
        totalSales,
        aov,
        orderCount,
        productCount: productCount || 0,
        revenueData,
        inventoryData: [
          { name: 'Total Joyas', cantidad: productCount || 0 },
          { name: 'Pedidos', cantidad: orderCount }
        ]
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return <div style={{ color: 'var(--on-surface-variant)', padding: '2rem' }}>Cargando boveda analítica...</div>

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Panel Analítico</h1>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '3rem' }}>Visión global de métricas reales desde Supabase.</p>

      {/* Top Value Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="panel-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ventas Totales</div>
          <div style={{ color: 'var(--primary)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
            ${(stats.totalSales / 1000).toFixed(1)}k
          </div>
          <div style={{ color: '#00d084', fontSize: '0.75rem', marginTop: '0.5rem' }}>Basado en {stats.orderCount} pedidos</div>
        </div>
        <div className="panel-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Promedio (AOV)</div>
          <div style={{ color: 'var(--on-surface)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
            ${(stats.aov / 1000).toFixed(1)}k
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Eficiencia de Venta</div>
        </div>
        <div className="panel-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Piezas en Catálogo</div>
          <div style={{ color: 'var(--on-surface)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
            {stats.productCount}
          </div>
          <div style={{ color: '#00d084', fontSize: '0.75rem', marginTop: '0.5rem' }}>Inventario Activo</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Trend Revenue */}
        <div className="panel-elevated" style={{ padding: '2rem', width: '100%', overflowX: 'auto' }}>
           <h3 style={{ fontSize: '1rem', color: 'var(--on-surface)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Tendencia de Ventas (Mensual)</h3>
           <div style={{ width: '100%', height: 300, minWidth: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-container)', border: '1px solid var(--outline)', borderRadius: 0 }} />
                <Line type="monotone" dataKey="total" name="Ventas" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* Volume comparison */}
        <div className="panel-elevated" style={{ padding: '2rem', width: '100%', overflowX: 'auto' }}>
           <h3 style={{ fontSize: '1rem', color: 'var(--on-surface)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Volumen Operativo</h3>
           <div style={{ width: '100%', height: 300, minWidth: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-container)', border: '1px solid var(--outline)', borderRadius: 0, color: 'var(--on-surface)' }} itemStyle={{ color: 'var(--on-surface)'}} cursor={{fill: 'var(--surface-high)'}} />
                <Bar dataKey="cantidad" name="Cantidad" fill="var(--outline-variant)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  )
}
