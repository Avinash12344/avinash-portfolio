import "./globals.css";

export const metadata = {
  metadataBase: new URL(
    "http://localhost:3000"
  ),

  title:
    "Avinash Vishwakarma | Full-Stack Developer",

  description:
    "Portfolio of Avinash Vishwakarma — Full-Stack Developer building modern web applications, APIs, backend systems, and Shopify solutions.",

  keywords: [
    "Avinash Vishwakarma",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Backend Developer",
    "Shopify Developer",
    "JavaScript Developer",
  ],

  authors: [
    {
      name: "Avinash Vishwakarma",
    },
  ],

  creator: "Avinash Vishwakarma",

  openGraph: {
    title:
      "Avinash Vishwakarma | Full-Stack Developer",

    description:
      "Building modern web applications, APIs, backend systems, and Shopify solutions.",

    type: "website",

    locale: "en_US",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}