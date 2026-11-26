import { Component, viewChild, ElementRef, signal, OnInit, OnDestroy } from '@angular/core';
import { TransactionsService } from '../../core/services/transactions.service';
import { Subscription } from 'rxjs';
import {
  Transaction,
  TransactionCategory,
  TransactionPagination,
  TransactionType,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from './interfaces/transactions.interface';
import { TransactionForm } from './components/transaction-form/transaction-form';
import {
  TransactionFilters,
  TransactionsTable,
} from './components/transactions-table/transactions-table';
@Component({
  imports: [TransactionForm, TransactionsTable],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit, OnDestroy{

  mode = signal<'add' | 'edit'>('add');
  selectedTransaction = signal<Transaction | null>(null)
  private sub = new Subscription();
  private loadSub: Subscription | null = null;
  transactions = signal<Transaction[]>([]);
  pagination = signal<TransactionPagination | null>(null);
  month = signal('');
  category = signal<TransactionCategory | ''>('');
  type = signal<TransactionType | ''>('');
  page = signal(1);
  pageSize = signal(10);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  readonly categories: readonly TransactionCategory[] = [
    ...INCOME_CATEGORIES,
    ...EXPENSE_CATEGORIES,
  ];
 
  private readonly transactionDialog =
  viewChild.required<ElementRef<HTMLDialogElement>>('transactionDialog');


  constructor(
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loadSub?.unsubscribe();
    this.loading.set(true);
    this.errorMessage.set(null);
    this.loadSub = this.transactionsService.getTransactions({
      month: this.month() || undefined,
      category: this.category() || undefined,
      type: this.type() || undefined,
      page: this.page(),
      limit: this.pageSize(),
    }).subscribe({
      next: (res) => {
        this.transactions.set(res.data.transactions ?? []);
        this.pagination.set(res.data.pagination);
        this.page.set(res.data.pagination.currentPage);
        this.pageSize.set(res.data.pagination.limit);
        this.loading.set(false);
      },
      error: (err) => {
        this.transactions.set([]);
        this.pagination.set(null);
        this.errorMessage.set(err?.error?.message || 'Failed to load transactions');
        this.loading.set(false);
      },
    });
  }

  deleteTransaction(id: string): void {

    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    this.sub.add(
      this.transactionsService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (err) => {
          alert(err?.error?.message || 'Delete failed')
        },
      })
    );
  }

  applyFilters(): void {
    this.page.set(1);
    this.loadTransactions();
  }

  onFiltersChanged(filters: TransactionFilters): void {
    this.month.set(filters.month);
    this.category.set(filters.category);
    this.type.set(filters.type);
    this.applyFilters();
  }

  goToPage(page: number): void {
    const pagination = this.pagination();
    if (!pagination || page < 1 || page > pagination.totalPages) return;

    this.page.set(page);
    this.loadTransactions();
  }

  openAddDialog(): void {
    this.mode.set('add');
    this.selectedTransaction.set(null);
    this.transactionDialog().nativeElement.showModal();
  }

  openEditDialog(transaction: Transaction): void {
    this.mode.set('edit');
    this.selectedTransaction.set(transaction);
    this.transactionDialog().nativeElement.showModal();
  }


  // openTransactionDialog(): void {
  //   this.transactionDialog().nativeElement.showModal();
  // }

  closeTransactionDialog(): void {
    this.transactionDialog().nativeElement.close();
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.transactionDialog().nativeElement) {
      this.closeTransactionDialog();
    }
  }

  onTransactionSaved(): void {
    this.closeTransactionDialog();
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.loadSub?.unsubscribe();
    this.sub.unsubscribe();
  }
}