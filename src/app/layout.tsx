import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider as NextThemeProvider } from '@/components/theme-provider'
import { ThemeProvider as ProductLineThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo',
    template: '%s | DA LUZ CONSCIENTE'
  },
  description: 'DA LUZ CONSCIENTE presenta "Alkimyas para alma y cuerpo", unificando productos biocosmecéticos artesanales y servicios holísticos para la vida consciente.',
  keywords: [
    'alkimyas',
    'biocosmética artesanal',
    'productos naturales',
    'vida consciente',
    'transformación personal',
    'ceramica personalizada',
    'flores silvestres',
    'viveros'
  ],
  authors: [{ name: 'DA LUZ CONSCIENTE' }],
  creator: 'DA LUZ CONSCIENTE',
  publisher: 'DA LUZ CONSCIENTE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://daluzconsciente.com',
    title: 'DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo',
    description: 'Productos biocosmecéticos artesanales y servicios holísticos para la vida consciente.',
    siteName: 'DA LUZ CONSCIENTE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo',
    description: 'Productos biocosmecéticos artesanales y servicios holísticos para la vida consciente.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <NextThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ProductLineThemeProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <Toaster position="top-right" />
              </CartProvider>
            </AuthProvider>
          </ProductLineThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  )
} 