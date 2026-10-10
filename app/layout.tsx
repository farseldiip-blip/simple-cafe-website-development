import type { Metadata, Viewport } from 'next'; import { Jost, Tajawal } from 'next/font/google'; import './globals.css';
const jost=Jost({subsets:['latin'],variable:'--font-display',display:'swap'}); const tajawal=Tajawal({subsets:['arabic'],variable:'--font-arabic',display:'swap',weight:['400','500','700']});
export const metadata:Metadata={title:{default:'Simple Cafe | Mansoura',template:'%s | Simple Cafe'},description:"Life's complicated. But coffee's simple.",metadataBase:new URL('https://simplecafe.eg'),openGraph:{title:'Simple Cafe',description:"Life's complicated. But coffee's simple.",images:['/images/brand/logo-source.jpg'],type:'website'}};
export const viewport:Viewport={themeColor:'#F3ECE0',colorScheme:'light'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" dir="ltr"><body className={`${jost.variable} ${tajawal.variable}`}>{children}</body></html>}
