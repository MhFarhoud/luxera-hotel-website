import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'سیستم مدیریت یکپارچه هتل LUXERA | PMS، پرتال مهمان و عملیات هتل',description:'لوکسرا یک سیستم عامل فارسی هتلداری برای مدیریت رزرو، پذیرش، اتاق، خانه‌داری، خدمات، رستوران، مالی، CRM، انبار، تعمیرات و پرتال QR مهمان است.',keywords:['نرم افزار مدیریت هتل','سیستم PMS هتل','پرتال مهمان هتل','نرم افزار پذیرش هتل','مدیریت خانه‌داری هتل','سیستم سفارش روم سرویس','نرم افزار هتلداری فارسی','مدیریت یکپارچه عملیات هتل'],icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body>{children}</body></html>}
