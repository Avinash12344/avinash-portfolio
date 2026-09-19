import "./globals.css";
import "./styles/CustomCursor.css";
import CustomCursor from "./components/CustomCursor";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Avinash Vishwakarma | Full-Stack Developer",
    template: "%s | Avinash Vishwakarma",
  },

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
    { name: "Avinash Vishwakarma", url: siteUrl },
  ],

  creator: "Avinash Vishwakarma",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Avinash Vishwakarma",
    title: "Avinash Vishwakarma | Full-Stack Developer",
    description:
      "Building modern web applications, APIs, backend systems, and Shopify solutions.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Avinash Vishwakarma | Full-Stack Developer",
    description:
      "Building modern web applications, APIs, backend systems, and Shopify solutions.",
  },

  verification: {
    google: "P6EMH_1O8rvxdcHIGSXEYrzWB_B34yaMLrTIY8ujXrk",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}