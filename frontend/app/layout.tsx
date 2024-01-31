import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from "./providers/nextAuthProvider";
import { ThemeProvider } from './providers/themeProvider';
import { SiteHeader } from '@/components/navbar/site-header';
import QueryProvider from './providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fut turniri',
  description: 'Sajt za kreiranje fudbalskih turnira',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <SiteHeader />
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
