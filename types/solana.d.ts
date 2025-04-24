declare module '@solana/wallet-adapter-react' {
  import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
  import { FC, ReactNode } from 'react';
  import { Adapter, WalletError } from '@solana/wallet-adapter-base';

  export interface WalletContextState {
    autoConnect: boolean;
    wallets: Adapter[];
    wallet: Adapter | null;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    select(walletName: string): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(
      transaction: Transaction | VersionedTransaction,
      connection: Connection,
      options?: SendTransactionOptions
    ): Promise<string>;
    signTransaction: ((transaction: Transaction) => Promise<Transaction>) | undefined;
    signAllTransactions: ((transactions: Transaction[]) => Promise<Transaction[]>) | undefined;
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined;
  }

  export interface WalletProviderProps {
    children: ReactNode;
    wallets: Adapter[];
    autoConnect?: boolean;
    onError?: (error: WalletError) => void;
    localStorageKey?: string;
  }

  export const WalletProvider: FC<WalletProviderProps>;
  export const useWallet: () => WalletContextState;
  export const useConnection: () => { connection: Connection };
  export const ConnectionProvider: FC<{ endpoint: string; children: ReactNode }>;
}

declare module '@solana/wallet-adapter-react-ui' {
  import { FC, ReactNode } from 'react';
  
  export interface WalletModalProviderProps {
    children: ReactNode;
    logo?: ReactNode;
  }
  
  export const WalletModalProvider: FC<WalletModalProviderProps>;
  export const WalletMultiButton: FC;
  export const WalletConnectButton: FC;
  export const WalletDisconnectButton: FC;
}

declare module '@solana/wallet-adapter-base' {
  export enum WalletAdapterNetwork {
    Mainnet = 'mainnet-beta',
    Testnet = 'testnet',
    Devnet = 'devnet'
  }
  
  export interface Adapter {
    name: string;
    url: string;
    icon: string;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    readyState: WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction?(
      transaction: Transaction,
      connection: Connection,
      options?: SendOptions
    ): Promise<string>;
    signTransaction?: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
    signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
  }
  
  export interface WalletError {
    name: string;
    message: string;
  }
}

declare module '@solana/wallet-adapter-wallets' {
  import { Adapter } from '@solana/wallet-adapter-base';
  
  export class PhantomWalletAdapter implements Adapter {
    constructor(config?: any);
    name: string;
    url: string;
    icon: string;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    readyState: WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
  }
  
  export class SolflareWalletAdapter implements Adapter {
    constructor(config?: any);
    name: string;
    url: string;
    icon: string;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    readyState: WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
  }
} 