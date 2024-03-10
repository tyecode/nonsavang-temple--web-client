import { ThemeProvider } from '@/components/providers/theme-provider'

import './globals.css'

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
  title: 'ວັດໂນນສະຫວ່າງ | Nonsavang Temple',
  description: 'ເວັບໄຊຈັດການລາຍຮັບ-ລາຍຈ່າຍວັດໂນນສະຫວ່າງ',
  alternates: {
    canonical: '/',
    languages: {
      'lo-LA': '/lo-LA',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
