/**
 * Helper de Autorización y Control de Acceso basado en Roles (RBAC) para el Panel Administrativo.
 */

const DEFAULT_ADMIN_EMAILS = [
  'h.melotto@melottogroup.com',
  'hannah.melotto@melottogroup.com',
  'j.smolina.v10@gmail.com'
];

export function getAdminEmails() {
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : [];
  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...envEmails]));
}

/**
 * Valida si un usuario de Supabase tiene privilegios de administrador.
 * @param {object|null} user Objeto de usuario retornado por supabase.auth.getUser()
 * @returns {boolean} true si el usuario es administrador
 */
export function isAdmin(user) {
  if (!user || !user.email) return false;

  const email = user.email.toLowerCase();
  const adminEmails = getAdminEmails();

  // 1. Verificación por lista de correos autorizados
  if (adminEmails.includes(email)) return true;

  // 2. Verificación por metadata de rol en Supabase Auth
  if (user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') {
    return true;
  }

  return false;
}

