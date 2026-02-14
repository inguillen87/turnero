import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://turnero.pro"),
  title: "Turnero Pro - Gestiona tu negocio, no tu agenda",
  description: "El sistema de gestión de turnos definitivo para profesionales.",
  applicationName: "Turnero Pro",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Turnero Pro",
    title: "Turnero Pro - Gestiona tu negocio, no tu agenda",
    description: "El sistema de gestión de turnos definitivo para profesionales.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Turnero Pro - Gestiona tu negocio, no tu agenda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turnero Pro - Gestiona tu negocio, no tu agenda",
    description: "El sistema de gestión de turnos definitivo para profesionales.",
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Turnero Pro",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${plusJakartaSans.variable}`}>
      <body className="antialiased font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
