import './globals.css';

export const metadata = {
  title: 'GST CDA - GST Compliance Digital Assistant',
  description: 'GST Made Simple. Business Made Easy. Beginner-first Indian compliance SaaS.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}


