import {clearSessionCookie} from '@/lib/admin-auth';
import {json} from '@/lib/server';
export async function POST(req:Request){
  const origin=req.headers.get('origin');
  if(origin&&origin!==new URL(req.url).origin)return json({error:'مبدأ نامعتبر است.'},403);
  const response=json({ok:true});
  response.headers.set('Set-Cookie',clearSessionCookie(new URL(req.url).protocol==='https:'));
  return response;
}
