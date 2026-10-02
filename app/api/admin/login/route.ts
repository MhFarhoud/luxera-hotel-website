import {checkCredentials,makeSession,sessionCookie} from '@/lib/admin-auth';
import {database,json,payload} from '@/lib/server';
import {z} from 'zod';

export async function POST(req:Request){
  try{
    const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unknown';
    const key=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));
    const rateKey=Array.from(new Uint8Array(key),x=>x.toString(16).padStart(2,'0')).join('');
    const now=Math.floor(Date.now()/1000),window=15*60;
    const attempt=await database().prepare('SELECT attempts,window_start FROM admin_login_attempts WHERE key=?').bind(rateKey).first<{attempts:number;window_start:number}>();
    if(attempt&&now-attempt.window_start<window&&attempt.attempts>=5)return json({error:'تعداد تلاش‌ها بیش از حد مجاز است. ۱۵ دقیقه بعد دوباره تلاش کنید.'},429);
    const input=z.object({username:z.string().min(1).max(80),password:z.string().min(1).max(256)}).safeParse(await payload(req));
    if(!input.success)return json({error:'نام کاربری یا رمز عبور نامعتبر است.'},400);
    if(!await checkCredentials(input.data.username,input.data.password)){
      await database().prepare('INSERT INTO admin_login_attempts (key,attempts,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN ?-window_start>=? THEN 1 ELSE attempts+1 END,window_start=CASE WHEN ?-window_start>=? THEN ? ELSE window_start END').bind(rateKey,now,now,window,now,window,now).run();
      return json({error:'نام کاربری یا رمز عبور نادرست است.'},401);
    }
    await database().prepare('DELETE FROM admin_login_attempts WHERE key=?').bind(rateKey).run();
    const token=await makeSession();
    const response=json({ok:true});
    response.headers.set('Set-Cookie',sessionCookie(token,new URL(req.url).protocol==='https:'));
    return response;
  }catch{return json({error:'ورود مدیر در حال حاضر ممکن نیست.'},503)}
}
