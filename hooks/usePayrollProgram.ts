'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  SYSVAR_RENT_PUBKEY 
} from '@solana/web3.js';
import { AnchorProvider, Program, BN, Idl } from '@project-serum/anchor';
import { useState, useCallback, useMemo } from 'react';
import { PAYROLL_PROGRAM_ID, PayrollIDL, PaymentFrequency } from '@/lib/solana/payroll-idl';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

/**
 * Custom hook to interact with the Payroll Program on Solana blockchain
 */
export const usePayrollProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a compatible Anchor provider
  const anchorProvider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;
    
    // Create a wallet adapter that works with Anchor
    const customWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions || 
        (async (txs: Transaction[]) => {
          const signed = [];
          for (const tx of txs) {
            signed.push(await wallet.signTransaction!(tx));
          }
          return signed;
        }),
    };
    
    return new AnchorProvider(
      connection,
      customWallet,
      { commitment: 'confirmed' }
    );
  }, [connection, wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions]);

  // Initialize the program
  const program = useMemo(() => {
    if (!anchorProvider) return null;
    try {
      return new Program(PayrollIDL as Idl, PAYROLL_PROGRAM_ID, anchorProvider);
    } catch (error) {
      console.error('Error initializing Payroll program:', error);
      return null;
    }
  }, [anchorProvider]);

  // Find the PDA for payroll account
  const findPayrollAddress = useCallback(async (payrollId: string) => {
    if (!program) return null;
    
    const [payrollPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("payroll"), Buffer.from(payrollId)],
      PAYROLL_PROGRAM_ID
    );
    
    return payrollPDA;
  }, [program]);
  
  // Find the PDA for payroll vault
  const findPayrollVaultAddress = useCallback(async (payrollPDA: PublicKey) => {
    if (!program) return null;
    
    const [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), payrollPDA.toBuffer()],
      PAYROLL_PROGRAM_ID
    );
    
    return vaultPDA;
  }, [program]);
  
  // Find the PDA for employee account
  const findEmployeeAddress = useCallback(async (payrollPDA: PublicKey, employeeId: string) => {
    if (!program) return null;
    
    const [employeePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("employee"), payrollPDA.toBuffer(), Buffer.from(employeeId)],
      PAYROLL_PROGRAM_ID
    );
    
    return employeePDA;
  }, [program]);

  // Initialize a new payroll
  const initializePayroll = useCallback(async (
    payrollId: string,
    paymentToken: PublicKey
  ) => {
    if (!program || !wallet.publicKey) {
      const error = 'Wallet not connected or program not initialized';
      console.error(error);
      setError(error);
      return { success: false, error };
    }

    try {
      setLoading(true);
      setError(null);
      
      const payrollPDA = await findPayrollAddress(payrollId);
      if (!payrollPDA) throw new Error('Failed to generate payroll address');
      
      const vaultPDA = await findPayrollVaultAddress(payrollPDA);
      if (!vaultPDA) throw new Error('Failed to generate vault address');

      const tx = await program.methods
        .initializePayroll(payrollId, paymentToken)
        .accounts({
          payroll: payrollPDA,
          payrollVault: vaultPDA,
          paymentToken: paymentToken,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      
      return { success: true, txSignature: tx, payrollAddress: payrollPDA, vaultAddress: vaultPDA };
    } catch (err) {
      console.error('Initialize payroll error:', err);
      let errorMessage = 'Failed to initialize payroll';
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, findPayrollAddress, findPayrollVaultAddress]);

  // Add an employee to payroll
  const addEmployee = useCallback(async (
    payrollPDA: PublicKey,
    employeeId: string,
    employeeWallet: PublicKey,
    salaryAmount: number,
    paymentFrequency: 'Weekly' | 'BiWeekly' | 'Monthly'
  ) => {
    if (!program || !wallet.publicKey) {
      setError('Wallet not connected or program not initialized');
      return { success: false, error: 'Wallet not connected or program not initialized' };
    }

    try {
      setLoading(true);
      setError(null);

      const employeePDA = await findEmployeeAddress(payrollPDA, employeeId);
      if (!employeePDA) throw new Error('Failed to generate employee address');

      // Convert payment frequency to the format expected by the program
      let paymentFrequencyArg;
      if (paymentFrequency === 'Weekly') paymentFrequencyArg = { weekly: {} };
      else if (paymentFrequency === 'BiWeekly') paymentFrequencyArg = { biWeekly: {} };
      else paymentFrequencyArg = { monthly: {} };

      const tx = await program.methods
        .addEmployee(employeeId, new BN(salaryAmount), paymentFrequencyArg)
        .accounts({
          payroll: payrollPDA,
          employee: employeePDA,
          employeeWallet: employeeWallet,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return { success: true, txSignature: tx, employeeAddress: employeePDA };
    } catch (err) {
      console.error('Add employee error:', err);
      let errorMessage = 'Failed to add employee';
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, findEmployeeAddress]);

  // Process payment for an employee
  const processPayment = useCallback(async (
    payrollPDA: PublicKey,
    employeeId: string,
    employeePDA: PublicKey,
    employeeWallet: PublicKey,
    paymentToken: PublicKey
  ) => {
    if (!program || !wallet.publicKey) {
      const error = 'Wallet not connected or program not initialized';
      console.error(error);
      setError(error);
      return { success: false, error };
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Starting payment processing...');
      console.log('Payroll Address:', payrollPDA.toString());
      console.log('Employee ID:', employeeId);
      console.log('Employee Address:', employeePDA.toString());
      console.log('Employee Wallet:', employeeWallet.toString());
      console.log('Payment Token:', paymentToken.toString());
      console.log('User Wallet:', wallet.publicKey.toString());

      const vaultPDA = await findPayrollVaultAddress(payrollPDA);
      if (!vaultPDA) throw new Error('Failed to generate vault address');
      console.log('Generated Vault PDA:', vaultPDA.toString());

      console.log('Building transaction...');
      const tx = await program.methods
        .processPayment(employeeId)
        .accounts({
          payroll: payrollPDA,
          employee: employeePDA,
          payrollVault: vaultPDA,
          employeeWallet: employeeWallet,
          paymentToken: paymentToken,
          authority: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log('Transaction completed with signature:', tx);
      return { success: true, txSignature: tx };
    } catch (err) {
      console.error('Process payment error:', err);
      let errorMessage = 'Unknown error during transaction';
      if (err instanceof Error) {
        errorMessage = err.message;
        if (errorMessage.includes('User rejected')) errorMessage = 'Transaction was rejected in the wallet';
        else if (errorMessage.includes('Blockhash')) errorMessage = 'Transaction timed out - please try again';
        else if (errorMessage.includes('insufficient funds')) errorMessage = 'Insufficient funds for transaction';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, findPayrollVaultAddress]);

  // Update employee details
  const updateEmployee = useCallback(async (
    payrollPDA: PublicKey,
    employeePDA: PublicKey,
    salaryAmount: number,
    paymentFrequency: 'Weekly' | 'BiWeekly' | 'Monthly',
    isActive: boolean
  ) => {
    if (!program || !wallet.publicKey) {
      setError('Wallet not connected or program not initialized');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      let paymentFrequencyArg;
      if (paymentFrequency === 'Weekly') paymentFrequencyArg = { weekly: {} };
      else if (paymentFrequency === 'BiWeekly') paymentFrequencyArg = { biWeekly: {} };
      else paymentFrequencyArg = { monthly: {} };

      const tx = await program.methods
        .updateEmployee(new BN(salaryAmount), paymentFrequencyArg, isActive)
        .accounts({
          payroll: payrollPDA,
          employee: employeePDA,
          authority: wallet.publicKey,
        })
        .rpc();

      return { success: true, txSignature: tx };
    } catch (err) {
      console.error('Update employee error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey]);

  return {
    program,
    loading,
    error,
    connected: wallet.connected,
    publicKey: wallet.publicKey,
    initializePayroll,
    addEmployee,
    processPayment,
    updateEmployee,
    findPayrollAddress,
    findEmployeeAddress,
    findPayrollVaultAddress
  };
};