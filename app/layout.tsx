import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://taiki-kitazawa-research.kitatike-naist.chatgpt.site'),
  title: 'Taiki Kitazawa | Hardware Security Researcher',
  description:
    'Research in electromagnetic information leakage, TEMPEST, side-channel analysis, EMC, and signal integrity.',
  openGraph: {
    title: 'Taiki Kitazawa',
    description: 'Hardware Security · Electromagnetic Information Leakage',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taiki Kitazawa',
    description: 'Hardware Security · Electromagnetic Information Leakage',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
