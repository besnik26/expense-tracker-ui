import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionsService } from '../../core/services/transactions.service';
import { Subscription } from 'rxjs';
import { Transaction, TransactionType, CreateTransactionDto } from './interfaces/transactions.interface';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit{

  private sub = new Subscription();

  // state in signals
  transactions = signal<Transaction[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // category options derived from type
  readonly incomeCategories = [
    'Salary',
    'Freelance',
    'Gift',
    'Bonus',
    'Investment',
    'Other',
  ] as const;

  readonly expenseCategories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
  ] as const;

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionsService: TransactionsService
  ) {
    this.transactionForm = this.fb.group({
      type: ['expense', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      category: [null, Validators.required],
      date: [this.todayString(), Validators.required],
      description: [''],
    });

    this.listenToTypeChanges();
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  private todayString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private listenToTypeChanges(): void {
    const typeControl = this.transactionForm.get('type');
    if (!typeControl) return;

    this.sub.add(
      typeControl.valueChanges.subscribe((type: TransactionType) => {
        const categories = this.getCategoriesByType(type);

        const currentCategory = this.transactionForm.get('category')?.value;

        if (!categories.includes(currentCategory)) {
          this.transactionForm.patchValue({ category: categories[0] ?? null });
        }
      })
    );
  }

  getCategoriesByType(type: TransactionType): readonly string[] {
    return type === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  loadTransactions(): void {
    this.loading.set(true);
    this.error.set(null);

    this.sub.add(
      this.transactionsService.getTransactions({ page: 1, limit: 20 }).subscribe({
        next: (res) => {
          this.transactions.set(res.data.transactions ?? []);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to load transactions');
          this.loading.set(false);
        },
      })
    );
  }

  submit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formValue = this.transactionForm.getRawValue();

    const payload: CreateTransactionDto = {
      type: formValue.type,
      amount: Number(formValue.amount),
      category: formValue.category,
      date: formValue.date,
      description: formValue.description || '',
    };

    this.loading.set(true);

    this.sub.add(
      this.transactionsService.createTransaction(payload).subscribe({
        next: () => {
          this.transactionForm.reset({
            type: 'expense',
            amount: null,
            category: this.expenseCategories[0],
            date: this.todayString(),
            description: '',
          });

          this.loadTransactions();
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Create failed');
          this.loading.set(false);
        },
      })
    );
  }

  deleteTransaction(id: string): void {
    this.sub.add(
      this.transactionsService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions.update((items) =>
            items.filter((item) => item._id !== id)
          );
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Delete failed');
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}