'use client';

import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { ClientOnly } from '@/app/components/client-only';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaWalletProviderProps {
  children: React.ReactNode;
  network?: WalletAdapterNetwork;
}

export default function SolanaWalletProvider({ 
  children,
  network = WalletAdapterNetwork.Devnet 
}: SolanaWalletProviderProps) {
  // Set up Solana connection endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Set up supported wallet adapters
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  // Only render on the client side
  return (
    <ClientOnly>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ClientOnly>
  );
} 