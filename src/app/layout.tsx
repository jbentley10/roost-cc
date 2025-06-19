import { Bevan, Grand_Hotel, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import EventBanner from "@/components/event-banner";
import { fetchEvents } from "@/lib/contentfulData";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Declare fonts
const bevan = Bevan({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bevan",
});
const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-grand-hotel",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const events = await fetchEvents();

  return (
    <html
      lang='en'
      className={`${grandHotel.variable} ${bevan.variable} ${inter.variable}`}
    >
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-J8C3629HVQ"></Script>
        <Script id='gtag-script'>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J8C3629HVQ');`}
        </Script>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <Script
          type='text/javascript'
          src='//cdn.rlets.com/capture_configs/36a/304/d48/00a4a4486b7f71ae80fef9a.js'
        />
      </head>
      <body>
        <EventBanner events={events} />
        <Navigation />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
