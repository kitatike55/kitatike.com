import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://taiki-kitazawa-research.kitatike-naist.chatgpt.site'),
  title: 'Taiki Kitazawa | 北澤 太基',
  description:
    'Personal homepage of Taiki Kitazawa, Assistant Professor at Nara Institute of Science and Technology.',
  openGraph: {
    title: 'Taiki Kitazawa | 北澤 太基',
    description: 'Assistant Professor at Nara Institute of Science and Technology',
  },
  twitter: {
    card: 'summary',
    title: 'Taiki Kitazawa | 北澤 太基',
    description: 'Assistant Professor at Nara Institute of Science and Technology',
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
