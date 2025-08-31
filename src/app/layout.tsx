import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'VTU SGPA & CGPA Calculator - Fast & Accurate',
  description: 'Effortlessly calculate your VTU SGPA and CGPA with our fast and accurate calculator. Upload your marksheet (PDF or image) for automatic data extraction or enter marks manually. Get detailed results, including subject-wise grades and download a professional-looking marksheet.',
  keywords: ['VTU SGPA Calculator', 'VTU CGPA Calculator', 'SGPA Calculator', 'CGPA Calculator', 'VTU Results', 'VTU Marksheet', 'Visvesvaraya Technological University', 'Engineering Calculator', 'VTU Credits', 'SGPA to Percentage'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="VEgfXt5F6ZHp7aHQwXw7Wj7CGl3nV-FQd-uM7VqgTDc" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
            {children}
            <Analytics />
            <SpeedInsights />
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
