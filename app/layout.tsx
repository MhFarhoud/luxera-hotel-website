import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'LUXERA | سیستم عامل هوشمند هتلداری',description:'یک روز در هتل خود را با تجربه تعاملی LUXERA کشف کنید. دموی فارسی عملیات هتل، پذیرش، خانه‌داری و مدیریت.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body>{children}</body></html>}
