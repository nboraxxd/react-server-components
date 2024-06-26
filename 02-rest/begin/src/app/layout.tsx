import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={cn('min-h-screen', inter.className)}>{children}</body>
    </html>
  )
}
