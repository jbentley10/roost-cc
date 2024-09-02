"use client";

import { Bevan, Grand_Hotel, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";

// Declare fonts
const bevan = Bevan({
  subsets: ["latin"],
  weight: ["400"],
});
const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: ["400"],
});
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <style jsx global>{`
        h1,
        h2,
        h3,
        h4,
        button,
        span,
        .bevan {
          font-family: ${bevan.style.fontFamily};
          font-weight: 500;
        }

        h5,
        button > a,
        button,
        .grand-hotel {
          font-family: ${grandHotel.style.fontFamily};
        }

        p,
        a {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
