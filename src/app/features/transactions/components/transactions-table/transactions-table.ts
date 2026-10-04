import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  Transaction,
  TransactionCategory,
  TransactionPagination,
  TransactionType,
} from '../../interfaces/transactions.interface';

export interface TransactionFilters {
  month: string;
  category: TransactionCategory | '';
  type: TransactionType | '';
}

@Component({
  imports: [DatePipe],
  selector: 'app-transactions-table',
  styleUrl: './transactions-table.css',
  templateUrl: './transactions-table.html',
})
export class TransactionsTable {
  readonly transactions = input.required<Transaction[]>();
  readonly pagination = input<TransactionPagination | null>(null);
  readonly month = input('');
  readonly category = input<TransactionCategory | ''>('');
  readonly type = input<TransactionType | ''>('');
  readonly categories = input.required<readonly TransactionCategory[]>();
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly filtersChanged = output<TransactionFilters>();
  readonly pageChanged = output<number>();
  readonly deleteRequested = output<string>();
  readonly retryRequested = output<void>();

  hasActiveFilters(): boolean {
    return Boolean(this.month() || this.category() || this.type());
  }

  onMonthChange(event: Event): void {
    if (!(event.currentTarget instanceof HTMLInputElement)) return;
    this.emitFilters({ month: event.currentTarget.value });
  }

  onCategoryChange(event: Event): void {
    if (!(event.currentTarget instanceof HTMLSelectElement)) return;
    const selectedCategory = event.currentTarget.value;
    const category =
      this.categories().find((option) => option === selectedCategory) ?? '';
    this.emitFilters({ category });
  }

  onTypeChange(event: Event): void {
    if (!(event.currentTarget instanceof HTMLSelectElement)) return;
    const selectedType = event.currentTarget.value;
    const type =
      selectedType === 'income' || selectedType === 'expense' ? selectedType : '';
    this.emitFilters({ type });
  }

  clearFilters(): void {
    this.filtersChanged.emit({ month: '', category: '', type: '' });
  }

  private emitFilters(changes: Partial<TransactionFilters>): void {
    this.filtersChanged.emit({
      month: changes.month ?? this.month(),
      category: changes.category ?? this.category(),
      type: changes.type ?? this.type(),
    });
  }
}
