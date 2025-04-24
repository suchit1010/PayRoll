'use client';

import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { shortenAddress } from '@/lib/utils';
import { toast } from 'sonner';

export const WalletConnectButton: FC = () => {
  const { publicKey, connected, connecting, disconnecting } = useWallet();

  // Monitor wallet connection status
  useEffect(() => {
    if (connecting) {
      console.log('Wallet connecting...');
    }
    
    if (disconnecting) {
      console.log('Wallet disconnecting...');
    }
  }, [connecting, disconnecting]);

  return (
    <div className="relative">
      {connected && publicKey ? (
        <div className="flex flex-col items-end gap-1">
          <Button variant="outline" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>{shortenAddress(publicKey.toString())}</span>
          </Button>
          <span className="text-xs text-green-500">Connected to Phantom</span>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-1">
          <div className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-animation h-10 px-4 py-2 rounded-md">
            <WalletMultiButton />
          </div>
          <span className="text-xs text-orange-500">
            {connecting ? 'Connecting...' : 'Not connected'}
          </span>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton; 