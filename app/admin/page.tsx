import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {isAdmin} from '@/lib/admin-auth';
import AdminDashboard from '@/components/admin-dashboard';

export const dynamic='force-dynamic';
export default async function Page(){
  const h=await headers();
  if(!await isAdmin(new Request('https://luxera.local/admin',{headers:h})))redirect('/admin/login');
  return <AdminDashboard/>;
}
