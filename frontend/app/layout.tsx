import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DiabetesAnalyst Pro | ML-Powered Health Assessment',
  description: 'Professional diabetes risk prediction using XGBoost machine learning (85.2% accuracy) with evidence-based health recommendations',
  keywords: 'diabetes, prediction, health, AI, machine learning, medical assessment',
  authors: [{ name: 'DiabetesAnalyst Team' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
