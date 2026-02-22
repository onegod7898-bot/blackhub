import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import FirebaseProvider from "@/components/FirebaseProvider";
import NotificationPrompt from "@/components/NotificationPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlackHub - Subscription Marketplace",
  description: "Global subscription-based marketplace for buyers and sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('blackhub-theme');document.documentElement.classList.add(t==='light'?'light':'dark');})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider>
          <FirebaseProvider>
            {children}
            <NotificationPrompt />
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
