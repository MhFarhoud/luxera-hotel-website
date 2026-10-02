'use client';
import {useState,type FormEvent} from 'react';
import {ArrowRight,LockKeyhole,LogIn} from 'lucide-react';

export default function AdminLogin(){
  const [username,setUsername]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  async function submit(e:FormEvent){
    e.preventDefault();setBusy(true);setError('');
    try{
      const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({username,password})});
      const data=await r.json() as {error?:string};
      if(!r.ok)throw Error(data.error||'ورود ممکن نیست.');
      window.location.assign('/admin');
    }catch(e){setError(e instanceof Error?e.message:'ورود ممکن نیست.');setBusy(false)}
  }
  return <main className="admin-login-page" dir="rtl"><div className="admin-login-card"><a href="/" className="admin-login-brand">LUXERA<small>HOTEL OPERATING SYSTEM</small></a><span className="admin-login-icon"><LockKeyhole size={25}/></span><span className="section-index">ورود امن مدیر</span><h1>مرکز درخواست‌های LUXERA</h1><p>برای بررسی درخواست‌های تماس و دریافت خروجی JSON وارد شوید.</p><form onSubmit={submit}><label>نام کاربری<input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required/></label><label>رمز عبور<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<div className="admin-login-error" role="alert">{error}</div>}<button className="primary" disabled={busy}>{busy?'در حال ورود…':<>ورود به پنل <LogIn size={17}/></>}</button></form><a href="/" className="admin-login-back"><ArrowRight size={15}/> بازگشت به سایت</a></div></main>;
}
