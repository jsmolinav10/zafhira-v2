/**
 * Rate Limiter seguro para Next.js Edge Runtime / Serverless.
 * 
 * - Si UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN están configuradas,
 *   utiliza Upstash Redis mediante su API REST nativa (sin dependencias externas).
 * - En caso contrario, utiliza un mapa en memoria con limpieza automática y cabeceras estándar.
 */

const memoryStore = new Map();
let warnedAboutMemoryStore = false;

// Limpieza periódica de memoria para evitar fugas de memoria
function cleanMemoryStore() {
  const now = Date.now();
  for (const [key, value] of memoryStore.entries()) {
    if (now > value.resetAt) {
      memoryStore.delete(key);
    }
  }
}

/**
 * Aplica rate limit a una clave (normalmente IP del cliente).
 * @param {string} identifier Identificador único (IP o Token)
 * @param {object} options Opciones de límite
 * @param {number} options.limit Cantidad máxima de peticiones por ventana (default: 20)
 * @param {number} options.windowSeconds Duración de la ventana en segundos (default: 60)
 * @returns {Promise<{ success: boolean, limit: number, remaining: number, reset: number }>}
 */
export async function checkRateLimit(identifier, { limit = 20, windowSeconds = 60 } = {}) {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Modo Distribuido (Upstash Redis REST)
  if (upstashUrl && upstashToken) {
    try {
      const key = `rate_limit:${identifier}`;
      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds, 'NX'],
          ['TTL', key],
        ]),
        // Timeout de 1.5s para no penalizar latencia si redis está lento
        signal: AbortSignal.timeout(1500),
      });

      if (res.ok) {
        const results = await res.json();
        const currentCount = results[0]?.result ?? 1;
        const ttl = results[2]?.result ?? windowSeconds;
        const resetTimestamp = Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : windowSeconds);

        return {
          success: currentCount <= limit,
          limit,
          remaining: Math.max(0, limit - currentCount),
          reset: resetTimestamp,
        };
      }
    } catch (err) {
      console.warn('Fallo de conexión con Upstash Redis, usando fallback en memoria:', err.message);
    }
  } else if (!warnedAboutMemoryStore && process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️ AVISO: UPSTASH_REDIS_REST_URL no está configurada. El Rate Limiter opera en memoria local (no distribuida).'
    );
    warnedAboutMemoryStore = true;
  }

  // 2. Modo Fallback en memoria (Edge/Local)
  if (memoryStore.size > 1000) {
    cleanMemoryStore();
  }

  const now = Date.now();
  const clientData = memoryStore.get(identifier);

  if (!clientData || now > clientData.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    memoryStore.set(identifier, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.floor(resetAt / 1000),
    };
  }

  clientData.count++;
  const remaining = Math.max(0, limit - clientData.count);
  const success = clientData.count <= limit;

  return {
    success,
    limit,
    remaining,
    reset: Math.floor(clientData.resetAt / 1000),
  };
}

