import {env} from 'cloudflare:workers';
export function database(){if(!env.DB)throw Error('پایگاه داده فعلاً در دسترس نیست.');return env.DB;}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export function isAdmin(req:Request){const email=req.headers.get('oai-authenticated-user-email')?.toLowerCase();const admins=(env as unknown as {ADMIN_EMAILS?:string}).ADMIN_EMAILS?.toLowerCase().split(',').map(s=>s.trim())||[];return !!email&&admins.includes(email);}
export async function payload(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw Error('درخواست از مبدأ نامعتبر است.');if(!req.headers.get('content-type')?.includes('application/json'))throw Error('قالب درخواست نامعتبر است.');const body=await req.text();if(body.length>12000)throw Error('حجم درخواست بیش از حد مجاز است.');return JSON.parse(body);}
