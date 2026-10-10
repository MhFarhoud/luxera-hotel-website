import {Building2,CalendarDays,ChartNoAxesCombined,DoorOpen,Layers3,ShieldCheck,Smartphone} from 'lucide-react';
const benefits=[
{icon:Layers3,title:'عملیات یکپارچه',text:'رزرو، اقامت، اتاق، خدمات، سفارش، صورتحساب و پروفایل مهمان در یک جریان داده متصل‌اند.'},
{icon:CalendarDays,title:'ساخته‌شده برای کار واقعی هتل',text:'ظرفیت بزرگسال و کودک، همراهان، مدارک، تضمین و بازرسی خروج در گردش پذیرش لحاظ شده‌اند.'},
{icon:Smartphone,title:'تجربه موبایلی مهمان',text:'پرتال وب مهمان با QR اقامت باز می‌شود؛ بدون نصب اپلیکیشن یا فرم ورود.'},
{icon:ChartNoAxesCombined,title:'کنترل لحظه‌ای مدیر',text:'اشغال، ورود و خروج، درخواست‌ها، SLA و درآمد روز در داشبورد مدیریتی دیده می‌شوند.'},
{icon:ShieldCheck,title:'دسترسی متناسب با شغل',text:'نقش و مجوز هر کارمند، دپارتمان یا تبلت در رابط و API کنترل می‌شود.'},
{icon:Building2,title:'ماژولار برای هر هتل',text:'هتل از امکانات لازم شروع می‌کند و داده تاریخی با خاموش‌شدن یک ماژول حذف نمی‌شود.'},
{icon:DoorOpen,title:'فارسی و مناسب ایران',text:'رابط RTL، فونت Vazirmatn، تاریخ جلالی و ثبت دقیق مبالغ با Decimal.'},
];
export default function OfficialBenefits(){return <section className="official-benefits" id="benefits"><div className="section-head"><div><span className="section-index">چرا لوکسرا؟</span><h2>برای تمام لحظه‌های هتل،<br/><em>یک جریان هماهنگ.</em></h2></div><p>از لحظه جست‌وجوی اتاق تا خروج مهمان، مدیر و کارکنان به اطلاعات هماهنگ، قابل پیگیری و متناسب با نقش خود دسترسی دارند.</p></div><div className="official-benefit-grid">{benefits.map(({icon:Icon,title,text})=><article key={title}><span><Icon size={25} strokeWidth={1.7}/></span><h3>{title}</h3><p>{text}</p></article>)}</div><a className="official-benefits-more" href="/features">مشاهده جزئیات همه امکانات <span aria-hidden="true">↖</span></a></section>}
