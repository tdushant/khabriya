import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TV App',
  description: 'A simple TV app with channel browsing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="canonical" href="https://livetv.neotvapp.com/" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet"/>
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="NeoTV+ | Free AD Supported TV | FAST TV application offer live tv channels in India."
        />
        <meta
          property="og:description"
          content="Neo TV+ is live tv streaming app. Watch ( FAST TV )Free tv on your Smart TV or Mobile."
        />
        <meta property="og:url" content="https://livetv.neotvapp.com/" />
        <meta
          property="og:site_name"
          content="NeoTV+ | Free AD Supported TV | FAST TV application offer live tv channels in India."
        />
        <meta
          property="og:image"
          content="https://neotvapp.com/wp-content/uploads/2024/09/neo-tv-banner.jpg"
        />
        <meta property="og:image:width" content="1639" />
        <meta property="og:image:height" content="765" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
