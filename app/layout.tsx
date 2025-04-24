import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import SolanaWalletProvider from '@/components/SolanaWalletProvider'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Payroll System',
  description: 'Solana-based Payroll Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body 
        className={`${inter.className} min-h-screen bg-background antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <SolanaWalletProvider network={WalletAdapterNetwork.Devnet}>
            <main className="relative flex min-h-screen flex-col">
              {children}
            </main>
          </SolanaWalletProvider>
        </Providers>
      </body>
    </html>
  )
}
