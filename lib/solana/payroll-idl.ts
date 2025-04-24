import { PublicKey } from '@solana/web3.js';

export const PAYROLL_PROGRAM_ID = new PublicKey('4tVr3RJmMvPqfjsK7r3vCfoG2shrukhtXBfAFNZZ1dz6');

export type PaymentFrequency = {
  weekly: {};
} | {
  biWeekly: {};
} | {
  monthly: {};
};

export interface Employee {
  payroll: PublicKey;
  employeeId: string;
  wallet: PublicKey;
  salaryAmount: bigint;
  paymentFrequency: PaymentFrequency;
  lastPayment: bigint;
  isActive: boolean;
}

export interface Payroll {
  authority: PublicKey;
  payrollId: string;
  paymentToken: PublicKey;
  employeeCount: bigint;
  isActive: boolean;
}

export const PayrollIDL = {
  version: '0.1.0',
  name: 'payroll_confidential',
  instructions: [
    {
      name: 'addEmployee',
      accounts: [
        { name: 'payroll', isMut: true },
        { name: 'employee', isMut: true },
        { name: 'employeeWallet', isMut: false },
        { name: 'authority', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false },
        { name: 'rent', isMut: false }
      ],
      args: [
        { name: 'employeeId', type: 'string' },
        { name: 'salaryAmount', type: 'u64' },
        { name: 'paymentFrequency', type: { defined: 'PaymentFrequency' } }
      ]
    },
    {
      name: 'initializePayroll',
      accounts: [
        { name: 'payroll', isMut: true },
        { name: 'payrollVault', isMut: true },
        { name: 'paymentToken', isMut: false },
        { name: 'authority', isMut: true, isSigner: true },
        { name: 'systemProgram', isMut: false },
        { name: 'tokenProgram', isMut: false },
        { name: 'rent', isMut: false }
      ],
      args: [
        { name: 'payrollId', type: 'string' },
        { name: 'paymentToken', type: 'pubkey' }
      ]
    },
    {
      name: 'processPayment',
      accounts: [
        { name: 'payroll', isMut: false },
        { name: 'employee', isMut: true },
        { name: 'payrollVault', isMut: true },
        { name: 'employeeWallet', isMut: true },
        { name: 'paymentToken', isMut: false },
        { name: 'authority', isMut: false, isSigner: true },
        { name: 'tokenProgram', isMut: false },
        { name: 'systemProgram', isMut: false }
      ],
      args: [
        { name: 'employeeId', type: 'string' }
      ]
    },
    {
      name: 'updateEmployee',
      accounts: [
        { name: 'payroll', isMut: false },
        { name: 'employee', isMut: true },
        { name: 'authority', isMut: false, isSigner: true }
      ],
      args: [
        { name: 'salaryAmount', type: 'u64' },
        { name: 'paymentFrequency', type: { defined: 'PaymentFrequency' } },
        { name: 'isActive', type: 'bool' }
      ]
    }
  ],
  accounts: [
    { name: 'Employee', type: { kind: 'struct', fields: [] } },
    { name: 'Payroll', type: { kind: 'struct', fields: [] } }
  ],
  errors: [
    { code: 6000, name: 'PayrollInactive', msg: 'Payroll is not active' },
    { code: 6001, name: 'EmployeeInactive', msg: 'Employee is not active' },
    { code: 6002, name: 'InvalidPayroll', msg: 'Invalid payroll account' },
    { code: 6003, name: 'InvalidEmployeeId', msg: 'Invalid employee ID' },
    { code: 6004, name: 'PaymentTooSoon', msg: 'Payment attempted too soon' },
    { code: 6005, name: 'InvalidWallet', msg: 'Invalid wallet account' },
    { code: 6006, name: 'ArithmeticOverflow', msg: 'Arithmetic overflow occurred' },
    { code: 6007, name: 'ActiveEmployeesExist', msg: 'Active employees exist' }
  ],
  types: [
    {
      name: 'PaymentFrequency',
      type: {
        kind: 'enum',
        variants: [
          { name: 'Weekly' },
          { name: 'BiWeekly' },
          { name: 'Monthly' }
        ]
      }
    }
  ]
}; 