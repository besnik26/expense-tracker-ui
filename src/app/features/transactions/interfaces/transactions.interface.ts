export type TransactionType = 'income' | 'expense';

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Gift',
  'Bonus',
  'Investment',
  'Other',
] as const;

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string; // ISO string like "2026-08-30"
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string;
  description?: string;
}

export interface UpdateTransactionDto {
  type?: TransactionType;
  amount?: number;
  category?: TransactionCategory;
  date?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TransactionPagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export interface TransactionsApiResponse {
  success: boolean;
  data: TransactionListResponse;
}