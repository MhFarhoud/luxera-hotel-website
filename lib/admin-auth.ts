import { env } from 'cloudflare:workers';

const COOKIE = 'luxera_admin';
const TTL = 12 * 60 * 60;
type Config = { ADMIN_USERNAME?: string; ADMIN_PASSWORD_HASH?: string; ADMIN_SESSION_SECRET?: string };
const config = () => env as unknown as Config;
const bytes = (hex: string) => Uint8Array.from(hex.match(/../g) || [], x => parseInt(x, 16));
const hex = (value: ArrayBuffer) => Array.from(new Uint8Array(value), x => x.toString(16).padStart(2, '0')).join('');
const encoder = new TextEncoder();

async function signature(message: string) {
  const secret = config().ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return '';
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

export async function checkCredentials(username: string, password: string) {
  const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH } = config();
  const [salt, expected] = (ADMIN_PASSWORD_HASH || '').split(':');
  if (!ADMIN_USERNAME || !salt || !expected || salt.length !== 32 || expected.length !== 64) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const actual = hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: bytes(salt), iterations: 210000, hash: 'SHA-256' }, key, 256));
  // Compare the derived values without an early exit.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return username === ADMIN_USERNAME && diff === 0;
}

export async function makeSession() {
  const expires = Math.floor(Date.now() / 1000) + TTL;
  const nonce = hex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const message = `${expires}.${nonce}`;
  const sig = await signature(message);
  if (!sig) throw Error('تنظیمات ورود مدیر کامل نیست.');
  return `${message}.${sig}`;
}

export async function isAdmin(req: Request) {
  const raw = req.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!raw) return false;
  const [expiry, nonce, supplied, extra] = raw.split('.');
  if (extra || !/^\d{10}$/.test(expiry || '') || !/^[a-f0-9]{32}$/.test(nonce || '') || !/^[a-f0-9]{64}$/.test(supplied || '')) return false;
  if (Number(expiry) <= Math.floor(Date.now() / 1000)) return false;
  const expected = await signature(`${expiry}.${nonce}`);
  if (!expected) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return diff === 0;
}

export function sessionCookie(value: string, secure: boolean) {
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL}${secure ? '; Secure' : ''}`;
}
export function clearSessionCookie(secure: boolean) {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`;
}
