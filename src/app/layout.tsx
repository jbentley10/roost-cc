"use client";

import { Bevan, Grand_Hotel, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import Script from "next/script";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${grandHotel.variable} ${bevan.variable} ${inter.variable}`}
    >
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body>
        <Navigation />
        {children}
        <Footer />
        <Script
          id='signupScript'
          src='//static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js'
          strategy='lazyOnload'
        />
        <Script id='cc-var'>
          {" "}
          var _ctct_m = &quot;80340fa0b2980f0bbdae8929a468d1b6&quot;;{" "}
        </Script>
      </body>
    </html>
  );
}
