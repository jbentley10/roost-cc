import { Grand_Hotel, Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import EventBanner from "@/components/event-banner";
import { fetchEvents } from "@/lib/contentfulData";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";

// Declare fonts
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
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
      className={`${grandHotel.variable} ${playfairDisplay.variable} ${inter.variable}`}
      suppressHydrationWarning
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
        <ThemeProvider
          attribute='data-theme'
          defaultTheme='1a'
          themes={["1a", "1b", "2a"]}
          storageKey='roost-theme'
          enableSystem={false}
        >
          <EventBanner events={events} />
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
