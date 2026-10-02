import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {isAdmin} from '@/lib/admin-auth';
import AdminLogin from '@/components/admin-login';

export const dynamic='force-dynamic';
export default async function Page(){
  const h=await headers();
  if(await isAdmin(new Request('https://luxera.local/admin/login',{headers:h})))redirect('/admin');
  return <AdminLogin/>;
}
