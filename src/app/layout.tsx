import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import FirebaseProvider from "@/components/FirebaseProvider";
import NotificationPrompt from "@/components/NotificationPrompt";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://blackhub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BlackHub - Subscription Marketplace for Global Sellers",
    template: "%s | BlackHub",
  },
  description:
    "List products, get subscribers, grow your business. BlackHub is a global subscription marketplace connecting buyers and sellers. 7-day free trial. NGN & USD.",
  keywords: ["subscription marketplace", "sell online", "Nigeria", "global sellers", "NGN", "USD", "ecommerce"],
  authors: [{ name: "BlackHub", url: BASE_URL }],
  creator: "BlackHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "BlackHub",
    title: "BlackHub - Subscription Marketplace for Global Sellers",
    description: "List products, get subscribers, grow your business. 7-day free trial. NGN & USD.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "BlackHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackHub - Subscription Marketplace",
    description: "List products, get subscribers, grow your business. 7-day free trial.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/logo.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "BlackHub",
              url: BASE_URL,
              description: "Subscription marketplace for global sellers. List products, get subscribers, grow your business.",
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/explore?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('blackhub-theme');document.documentElement.classList.add(t==='light'?'light':'dark');})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider>
          <ToastProvider>
            <FirebaseProvider>
            <div className="flex flex-col min-h-screen">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
            <NotificationPrompt />
            </FirebaseProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
