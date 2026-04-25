import crypto from 'crypto'

export const TWO_FACTOR_CODE_LENGTH = 6
export const TWO_FACTOR_CODE_TTL_MS = 10 * 60 * 1000
export const TWO_FACTOR_MAX_ATTEMPTS = 5
export const TWO_FACTOR_PENDING_COOKIE = 'pending_2fa'

export function generateNumericCode(length = TWO_FACTOR_CODE_LENGTH): string {
  const max = 10 ** length
  const buf = crypto.randomBytes(4)
  const num = buf.readUInt32BE(0) % max
  return num.toString().padStart(length, '0')
}

export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

function getSecret(): string {
  const secret =
    process.env.TWO_FACTOR_COOKIE_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) {
    throw new Error(
      'Missing TWO_FACTOR_COOKIE_SECRET (or SUPABASE_SERVICE_ROLE_KEY fallback) for 2FA cookie signing',
    )
  }
  return secret
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function fromBase64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4))
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64')
}

export interface PendingTwoFactor {
  userId: string
  email: string
  exp: number
}

export function signPendingCookie(payload: PendingTwoFactor): string {
  const body = base64url(JSON.stringify(payload))
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(body)
    .digest()
  return `${body}.${base64url(sig)}`
}

export function verifyPendingCookie(value: string): PendingTwoFactor | null {
  const parts = value.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = crypto
    .createHmac('sha256', getSecret())
    .update(body)
    .digest()
  const provided = fromBase64url(sig)
  if (
    expected.length !== provided.length ||
    !crypto.timingSafeEqual(expected, provided)
  ) {
    return null
  }
  try {
    const payload = JSON.parse(fromBase64url(body).toString('utf8')) as PendingTwoFactor
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.exp !== 'number'
    ) {
      return null
    }
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
