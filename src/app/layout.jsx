import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL &&
  !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://order.skilljobsnfc.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Skill Jobs NFC | Premium Smart Business Cards',
  description:
    'Skill Jobs NFC smart business cards allow you to instantly share your digital contact profile, social links, and portfolio with a simple tap on any smartphone.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Skill Jobs NFC | Premium Smart Business Cards',
    description:
      'Instantly share your digital contact profile, social links, and portfolio with a simple tap on any smartphone.',
    url: siteUrl,
    siteName: 'Skill Jobs NFC',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Skill Jobs NFC Smart Business Cards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill Jobs NFC | Premium Smart Business Cards',
    description:
      'Instantly share your digital contact profile, social links, and portfolio with a simple tap on any smartphone.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#05070c] text-[#f1f5f9] antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
