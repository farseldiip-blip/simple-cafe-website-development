import menu from '@/data/menu.json'; import settings from '@/data/settings.json'; import gallery from '@/data/gallery.json'; import reviews from '@/data/reviews.json';
export type Locale='en'|'ar';
export type Category={id:string; label_en:string; label_ar:string};
export type MenuItem={id:string;category:string;name_en:string;name_ar:string;description_en:string;description_ar:string;price:number;is_available:boolean;is_featured:boolean;sort_order:number;tags:string[];image_path:string};
export type SiteSettings=typeof settings; export type GalleryImage=typeof gallery[number]; export type Review=typeof reviews[number];
export interface MenuRepository {getCategories():Promise<Category[]>;getMenuItems():Promise<MenuItem[]>;getFeaturedItems():Promise<MenuItem[]>;getSiteSettings():Promise<SiteSettings>;getGalleryImages():Promise<GalleryImage[]>;getReviews():Promise<Review[]>}
const categories=[{id:'hot-coffee',label_en:'Hot coffee',label_ar:'ساخن'},{id:'iced-coffee',label_en:'Iced coffee',label_ar:'ساقع'},{id:'cold-drinks',label_en:'Cold drinks',label_ar:'مشروبات ساقعة'},{id:'breakfast',label_en:'Breakfast',label_ar:'فطار'},{id:'desserts',label_en:'Desserts',label_ar:'حلويات'}];
export const repository:MenuRepository={async getCategories(){return categories},async getMenuItems(){return menu as MenuItem[]},async getFeaturedItems(){return (menu as MenuItem[]).filter(x=>x.is_featured)},async getSiteSettings(){return settings},async getGalleryImages(){return gallery},async getReviews(){return reviews}};
export const imageUrl=(path:string)=>path||'';
export const t=(locale:Locale,en:string,ar:string)=>locale==='ar'?ar:en;
export const formatPrice=(price:number,locale:Locale)=>`${price} ${locale==='ar'?'ج.م':'EGP'}`;
export const navItems=[{id:'home',href:'',en:'Home',ar:'الرئيسية'},{id:'about',href:'#about',en:'About',ar:'عننا'},{id:'menu',href:'/menu',en:'Menu',ar:'المنيو'},{id:'gallery',href:'/gallery',en:'Gallery',ar:'الصور'},{id:'visit',href:'#visit',en:'Visit',ar:'زورنا'}];
