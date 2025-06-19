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
        <Script id="google-analytics">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-582SP45F');`}
        </Script>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <Script
          type='text/javascript'
          src='//cdn.rlets.com/capture_configs/36a/304/d48/00a4a4486b7f71ae80fef9a.js'
        />
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-582SP45F"
        height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe></noscript>
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
