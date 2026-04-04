"use client";

import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, subtotal, total, shippingMethod, setShippingMethod, shippingCost, isLoaded } = useCart();

  const handlePayment = (e) => {
    e.preventDefault();
    
    // Validamos que haya algo en el carrito
    if (cart.length === 0) {
      alert("Tu carrito está vacío. Agrega una joya primero.");
      return;
    }

    // 1. Calcular Monto en Centavos (Wompi requiere el monto con 2 ceros al final)
    const amountInCents = total * 100;

    // 2. Generar Referencia Única de Pedido
    const reference = `ZAFHIRA-${Date.now()}`;

    // 3. Llave Pública (Reemplazar esta de SANDBOX por la real luego)
    const publicKey = "pub_test_X0zDA9ooKGEidAO2wRmTz3W1t4k2O0d2"; // Ejemplo Sandbox Wompi

    // 4. URL de redirección cuando paguen (a nuestra propia web pública)
    const redirectUrl = "https://zafhira-v2.vercel.app/";

    // 5. Construir URL de Wompi Web Checkout
    const wompiCheckoutUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}&redirect-url=${redirectUrl}`;

    // 6. Redirigir al cliente a pagar
    window.location.href = wompiCheckoutUrl;
  };

  if (!isLoaded) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Cargando...</div>;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '120px 20px 50px', // Compensate for absolute header
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(300px, 0.8fr)',
      gap: '4rem',
      alignItems: 'start'
    }}>
      {/* LEFT COLUMN: FORM */}
      <section>
        <h1 style={{ fontFamily: 'Noto Serif, serif', fontSize: '2.5rem', marginBottom: '2rem' }}>
          Detalles de Envíos
        </h1>
        
        <form onSubmit={handlePayment} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Nombre *</label>
              <input type="text" required style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Apellidos *</label>
              <input type="text" required style={inputStyle} />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Nombre de la empresa (opcional)</label>
            <input type="text" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Identificación *</label>
            <input type="text" required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>País *</label>
            <input type="text" value="Colombia" readOnly style={{ ...inputStyle, background: 'var(--surface-high)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Dirección *</label>
            <input type="text" required placeholder="Número de casa y nombre de la calle" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Ciudad *</label>
            <input type="text" required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Departamento *</label>
            <select required style={inputStyle}>
              <option value="Distrito Capital">Distrito Capital</option>
              <option value="Antioquia">Antioquia</option>
              <option value="Valle del Cauca">Valle del Cauca</option>
              <option value="Cundinamarca">Cundinamarca</option>
              {/* Add others as needed */}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Teléfono *</label>
            <input type="tel" required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Dirección de correo electrónico *</label>
            <input type="email" required style={inputStyle} />
          </div>

          <button type="submit" className="btn-gold" style={{ marginTop: '2rem', width: '100%', fontSize: '1.2rem', padding: '20px' }}>
            PAGAR PEDIDO EN WOMPI
          </button>
        </form>
      </section>

      {/* RIGHT COLUMN: SUMMARY */}
      <section className="panel-soft" style={{ borderRadius: '4px' }}>
        <h2 style={{ fontFamily: 'Noto Serif, serif', fontSize: '2rem', marginBottom: '2rem', color: 'var(--primary-gold)' }}>
          Tu Pedido
        </h2>

        <div style={{ borderBottom: '1px solid var(--border-ghost)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Producto</span>
          <span>Subtotal</span>
        </div>

        {cart.length === 0 ? (
          <p style={{ margin: '2rem 0', color: 'var(--text-muted)' }}>Tu carrito está vacío.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem' }}>
                  <p>{item.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>× {item.quantity}</p>
                </div>
                <div style={{ fontWeight: '500' }}>
                  $ {(item.price * item.quantity).toLocaleString('es-CO')} COP
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-ghost)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <span>$ {subtotal.toLocaleString('es-CO')} COP</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-ghost)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <span>Envío</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'right' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="shipping" 
                checked={shippingMethod === 'fixed'} 
                onChange={() => setShippingMethod('fixed')}
                style={{ accentColor: 'var(--primary-gold)' }}
              />
              <span>Precio fijo: <strong>$ 22.000</strong></span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="shipping" 
                checked={shippingMethod === 'pickup'} 
                onChange={() => setShippingMethod('pickup')}
                style={{ accentColor: 'var(--primary-gold)' }}
              />
              <span style={{ textAlign: 'right' }}>
                Recoger en punto físico <br/>
                <small style={{ color: 'var(--text-muted)' }}>(Solo aplica para Bogotá)</small>
              </span>
            </label>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--border-ghost)', 
          paddingTop: '1.5rem', 
          marginTop: '1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'var(--primary-gold)'
        }}>
          <span>Total</span>
          <span>$ {total.toLocaleString('es-CO')} COP</span>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#FFFFFF', borderRadius: '4px', textAlign: 'center' }}>
          {/* Logo Placeholder Wompi */}
          <h3 style={{ color: '#1B1B1B', fontSize: '2rem', letterSpacing: '-1px' }}>Wompi</h3>
          <p style={{ color: '#4A4A4A', fontSize: '0.8rem', marginTop: '1rem', textAlign: 'left' }}>
            Tus datos personales se utilizarán para procesar tu pedido, mejorar tu experiencia en esta web y otros propósitos descritos en nuestra <strong>política de privacidad</strong>.
          </p>
        </div>

      </section>
    </div>
  );
}

const inputStyle = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border-ghost)',
  color: 'var(--text-main)',
  padding: '10px 0',
  fontSize: '1rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.3s'
};
