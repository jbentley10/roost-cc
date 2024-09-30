import { Bevan, Grand_Hotel, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import EventBanner, { Event } from "@/components/event-banner";
import { fetchEvents } from "@/lib/contentfulData";

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
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body>
        <EventBanner events={events} />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
