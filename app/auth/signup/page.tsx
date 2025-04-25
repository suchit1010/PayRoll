"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { WalletConnect } from "@/components/WalletConnect";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      // Here you would implement your actual registration logic
      // For demo purposes, we're just simulating a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWalletSuccess = (walletAddress: string) => {
    console.log("Signup page received wallet success:", walletAddress);
    // In a real app, you would create an account with the wallet address
    toast.success(`Account created with wallet: ${walletAddress}`);
    // Add a small delay before redirecting
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4 py-12">
      <Card className="w-full max-w-md border-[#1e293b] bg-[#0f172a]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="border-[#1e293b] bg-[#0f172a]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="border-[#1e293b] bg-[#0f172a]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="border-[#1e293b] bg-[#0f172a]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-blue-500 hover:text-blue-400">
                  terms and conditions
                </Link>
              </label>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e293b]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0f172a] px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <WalletConnect 
            onSuccess={handleWalletSuccess}
            buttonClassName="border-[#1e293b] hover:bg-[#1e293b]"
            buttonVariant="outline"
            fullWidth={true}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-400">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 