"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

interface WalletConnectProps {
  onSuccess?: (walletAddress: string) => void;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  fullWidth?: boolean;
}

export function WalletConnect({
  onSuccess,
  buttonClassName = "",
  buttonVariant = "outline",
  fullWidth = true,
}: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    console.log("Wallet connect button clicked");
    setIsConnecting(true);
    
    try {
      // Simulating wallet connection
      // In a real app, you would use a library like ethers.js, web3.js, or wallet connectors
      console.log("Simulating wallet connection...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock wallet address
      const mockWalletAddress = "0x" + Math.random().toString(16).slice(2, 12) + "...";
      console.log("Generated mock wallet address:", mockWalletAddress);
      
      toast.success(`Wallet connected: ${mockWalletAddress}`);
      
      // Call the success callback if provided
      if (onSuccess) {
        console.log("Calling onSuccess callback with address:", mockWalletAddress);
        onSuccess(mockWalletAddress);
      } else {
        console.log("No onSuccess callback provided");
      }
      
      return mockWalletAddress;
    } catch (error) {
      console.error("Wallet connection failed:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      type="button"
      variant={buttonVariant}
      className={`${fullWidth ? 'w-full' : ''} ${buttonClassName}`}
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
} 