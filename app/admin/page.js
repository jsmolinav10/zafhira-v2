'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { createClient } from '@/lib/supabase/client'

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalNetProfit: 0,
    totalBalance: 0,
    aov: 0,
    orderCount: 0,
    productCount: 0,
    inWorkshop: 0,
    inTransit: 0,
    revenueData: [],
    inventoryData: []
  })

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      // Fetch Orders for financial metrics and operational stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total, created_at, production_cost, accessories_cost, shipping_cost, paid_amount, workshop_status, shipping_status, delivery_method')
        .order('created_at', { ascending: true })

      // Fetch Products count
      const { count: productCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (ordersError || productsError) {
        console.error('Error fetching dashboard stats:', ordersError || productsError)
        setLoading(false)
        return
      }

      const orderList = orders || []
      const totalSales = orderList.reduce((acc, order) => acc + (order.total || 0), 0)
      const orderCount = orderList.length
      const aov = orderCount > 0 ? totalSales / orderCount : 0

      const totalNetProfit = orderList.reduce((acc, o) => {
        return acc + ((o.total || 0) - (o.production_cost || 0) - (o.accessories_cost || 0) - (o.shipping_cost || 0))
      }, 0)

      const totalBalance = orderList.reduce((acc, o) => {
        const balance = (o.total || 0) - (o.paid_amount || 0)
        return acc + (balance > 0 ? balance : 0)
      }, 0)

      const inWorkshop = orderList.filter(o =>
        o.workshop_status && o.workshop_status !== 'listo' && o.workshop_status !== 'por_iniciar'
      ).length

      const inTransit = orderList.filter(o =>
        o.shipping_status && o.shipping_status !== 'entregado' && o.shipping_status !== 'sin_despachar' && o.delivery_method !== 'oficina'
      ).length

      // Group monthly revenue and profit
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      const groupedData = orderList.reduce((acc, o) => {
        const date = new Date(o.created_at)
        const month = months[date.getMonth()]
        if (!acc[month]) acc[month] = { month, ventas: 0, ganancia: 0, count: 0 }
        acc[month].ventas += o.total || 0
        acc[month].ganancia += (o.total || 0) - (o.production_cost || 0) - (o.accessories_cost || 0) - (o.shipping_cost || 0)
        acc[month].count += 1
        return acc
      }, {})

      const revenueData = Object.values(groupedData)

      setStats({
        totalSales,
        totalNetProfit,
        totalBalance,
        aov,
        orderCount,
        productCount: productCount || 0,
        inWorkshop,
        inTransit,
        revenueData,
        inventoryData: [
          { name: 'Total Joyas', cantidad: productCount || 0 },
          { name: 'Pedidos', cantidad: orderCount },
          { name: 'En Taller', cantidad: inWorkshop },
          { name: 'En Envío', cantidad: inTransit },
        ]
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return <div style={{ color: 'var(--on-surface-variant)', padding: '2rem' }}>Cargando bóveda analítica...</div>

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Panel Analítico</h1>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '3rem' }}>Visión global de métricas reales desde Supabase.</p>

      {/* Top Value Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="panel-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ventas Totales</div>
          <div style={{ color: 'var(--primary)', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            ${(stats.totalSales / 1000000).toFixed(1)}M
          </div>
          <div style={{ color: '#51cf66', fontSize: '0.7rem', marginTop: '0.25rem' }}>Basado en {stats.orderCount} pedidos</div>
        </div>

        <div className="panel-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ganancia Neta</div>
          <div style={{ color: '#51cf66', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            ${(stats.totalNetProfit / 1000).toFixed(0)}k
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>Descontando taller y fletes</div>
        </div>

        <div className="panel-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cartera Activa</div>
          <div style={{ color: stats.totalBalance > 0 ? '#ff4444' : '#51cf66', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            ${stats.totalBalance > 0 ? (stats.totalBalance / 1000).toFixed(0) + 'k' : '0'}
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
            {stats.totalBalance > 0 ? 'Saldos pendientes' : 'Sin saldos pendientes ✅'}
          </div>
        </div>

        <div className="panel-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Promedio</div>
          <div style={{ color: 'var(--on-surface)', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            ${(stats.aov / 1000).toFixed(0)}k
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>AOV</div>
        </div>

        <div className="panel-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>En Taller</div>
          <div style={{ color: '#ffa94d', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            {stats.inWorkshop}
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>Piezas en producción</div>
        </div>

        <div className="panel-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Piezas Catálogo</div>
          <div style={{ color: 'var(--on-surface)', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            {stats.productCount}
          </div>
          <div style={{ color: '#51cf66', fontSize: '0.7rem', marginTop: '0.25rem' }}>Inventario activo</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Trend Revenue and Net Profit */}
        <div className="panel-elevated" style={{ padding: '2rem', width: '100%', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--on-surface)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Ventas vs Ganancia Neta (Mensual)</h3>
          <div style={{ width: '100%', height: 300, minWidth: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-container)', border: '1px solid var(--outline)', borderRadius: 0, color: 'var(--on-surface)' }} />
                <Line type="monotone" dataKey="ventas" name="Ventas" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="ganancia" name="Ganancia Neta" stroke="#51cf66" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
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
                <Tooltip contentStyle={{ background: 'var(--surface-container)', border: '1px solid var(--outline)', borderRadius: 0, color: 'var(--on-surface)' }} itemStyle={{ color: 'var(--on-surface)' }} cursor={{ fill: 'var(--surface-high)' }} />
                <Bar dataKey="cantidad" name="Cantidad" fill="var(--outline-variant)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
