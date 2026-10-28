import './globals.css';

export const metadata = {
  title: 'GST CDA - GST Compliance Digital Assistant',
  description: 'GST Made Simple. Business Made Easy. Beginner-first Indian compliance SaaS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

