"use client";

import { useCart } from "../../context/CartContext";
import { useState, useCallback } from "react";

export default function CheckoutPage() {
  const { cart, subtotal, total, shippingMethod, setShippingMethod, shippingCost, removeFromCart, isLoaded } = useCart();

  // Controlled form state (Bug B1 fix)
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    empresa: "",
    identificacion: "",
    pais: "Colombia",
    direccion: "",
    ciudad: "",
    departamento: "Distrito Capital",
    telefono: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Tu carrito está vacío. Agrega una joya primero.");
      return;
    }

    // Validate form fields
    const requiredFields = ['nombre', 'apellidos', 'identificacion', 'direccion', 'ciudad', 'telefono', 'email'];
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        alert(`Por favor complete el campo: ${field}`);
        return;
      }
    }

    // Sanitize inputs against XSS (Security S2 fix)
    const sanitize = (str) => str.replace(/[<>"'&]/g, '');
    const cleanForm = {};
    for (const key of Object.keys(form)) {
      cleanForm[key] = sanitize(form[key]);
    }

    // 1. Amount in cents (Wompi requirement)
    const amountInCents = total * 100;

    // 2. Secure unique reference (Security S3 fix — crypto random)
    const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    const reference = `ZAF-${Date.now()}-${randomPart}`;

    // 3. Wompi Public Key from env variable (Security S1 fix)
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_KEY || "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7";

    // 4. Redirect URL
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/`
      : "https://zafhira-v2.vercel.app/";

    // 5. Build Wompi Web Checkout URL
    const wompiUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}&redirect-url=${encodeURIComponent(redirectUrl)}`;

    // 6. Save order reference locally for verification
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('zafhira_last_order', JSON.stringify({
        reference,
        amount: total,
        items: cart,
        customer: cleanForm,
        timestamp: new Date().toISOString(),
      }));
    }

    // 7. Redirect to Wompi
    window.location.href = wompiUrl;
  };

  if (!isLoaded) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 6% 4rem',
      display: 'grid',
      gridTemplateColumns: '1.2fr 0.8fr',
      gap: '4rem',
      alignItems: 'start',
    }}>
      {/* LEFT COLUMN: FORM */}
      <section>
        <h1 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '2.5rem' }}>
          Detalles de Envíos
        </h1>

        <form onSubmit={handlePayment} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-field">
              <label htmlFor="nombre">Nombre *</label>
              <input id="nombre" name="nombre" type="text" required value={form.nombre} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="apellidos">Apellidos *</label>
              <input id="apellidos" name="apellidos" type="text" required value={form.apellidos} onChange={handleChange} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="empresa">Nombre de la empresa (opcional)</label>
            <input id="empresa" name="empresa" type="text" value={form.empresa} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label htmlFor="identificacion">Identificación *</label>
            <input id="identificacion" name="identificacion" type="text" required value={form.identificacion} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label htmlFor="pais">País *</label>
            <input id="pais" name="pais" type="text" value="Colombia" readOnly style={{ backgroundColor: 'var(--surface-low)', color: 'var(--text-muted)' }} />
          </div>

          <div className="form-field">
            <label htmlFor="direccion">Dirección *</label>
            <input id="direccion" name="direccion" type="text" required placeholder="Número de casa y nombre de la calle" value={form.direccion} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label htmlFor="ciudad">Ciudad *</label>
            <input id="ciudad" name="ciudad" type="text" required value={form.ciudad} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label htmlFor="departamento">Departamento *</label>
            <select id="departamento" name="departamento" required value={form.departamento} onChange={handleChange}>
              <option value="Distrito Capital">Distrito Capital</option>
              <option value="Antioquia">Antioquia</option>
              <option value="Valle del Cauca">Valle del Cauca</option>
              <option value="Cundinamarca">Cundinamarca</option>
              <option value="Atlántico">Atlántico</option>
              <option value="Santander">Santander</option>
              <option value="Bolívar">Bolívar</option>
              <option value="Boyacá">Boyacá</option>
              <option value="Nariño">Nariño</option>
              <option value="Norte de Santander">Norte de Santander</option>
              <option value="Tolima">Tolima</option>
              <option value="Cauca">Cauca</option>
              <option value="Meta">Meta</option>
              <option value="Risaralda">Risaralda</option>
              <option value="Caldas">Caldas</option>
              <option value="Huila">Huila</option>
              <option value="Magdalena">Magdalena</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Quindío">Quindío</option>
              <option value="Sucre">Sucre</option>
              <option value="Cesar">Cesar</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="telefono">Teléfono *</label>
            <input id="telefono" name="telefono" type="tel" required value={form.telefono} onChange={handleChange} pattern="[0-9]{7,10}" title="Ingrese un número válido de 7 a 10 dígitos" />
          </div>

          <div className="form-field">
            <label htmlFor="email">Dirección de correo electrónico *</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', width: '100%', fontSize: '1rem', padding: '20px' }}>
            PAGAR PEDIDO EN WOMPI
          </button>
        </form>
      </section>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <section className="panel-elevated" style={{ position: 'sticky', top: '100px' }}>
        <h2 className="font-serif text-gold" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
          Tu Pedido
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>Producto</span>
          <span>Subtotal</span>
        </div>

        {cart.length === 0 ? (
          <p style={{ margin: '2rem 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>Tu colección está vacía.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem' }}>
                  <p>{item.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>× {item.quantity}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: '500' }}>
                    $ {(item.price * item.quantity).toLocaleString('es-CO')} COP
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                    aria-label={`Eliminar ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <span>$ {subtotal.toLocaleString('es-CO')} COP</span>
        </div>

        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <span>Envío</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'right' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', cursor: 'pointer' }}>
              <input
                type="radio"
                name="shipping"
                checked={shippingMethod === 'fixed'}
                onChange={() => setShippingMethod('fixed')}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Precio fijo: <strong>$ 22.000</strong></span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', cursor: 'pointer' }}>
              <input
                type="radio"
                name="shipping"
                checked={shippingMethod === 'pickup'}
                onChange={() => setShippingMethod('pickup')}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span style={{ textAlign: 'right' }}>
                Recoger en punto físico<br/>
                <small style={{ color: 'var(--text-muted)' }}>(Solo aplica para Bogotá)</small>
              </span>
            </label>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--outline-variant)',
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '1.4rem',
          fontWeight: '600',
          color: 'var(--primary)',
        }}>
          <span>Total</span>
          <span>$ {total.toLocaleString('es-CO')} COP</span>
        </div>

        <div style={{ marginTop: '2.5rem', padding: '1.2rem', background: 'var(--surface-low)', textAlign: 'center' }}>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', lineHeight: '1.6' }}>
            Tus datos personales se utilizarán para procesar tu pedido. 
            Transacción segura y garantizada vía <strong style={{ color: 'var(--primary)' }}>Wompi</strong>.
          </p>
        </div>
      </section>

      {/* Responsive override for checkout */}
      <style jsx>{`
        @media (max-width: 768px) {
          div:first-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 1rem 4% 3rem !important;
          }
        }
      `}</style>
    </>
  );
}
