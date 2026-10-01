import { Component, viewChild, ElementRef, signal, OnInit, OnDestroy } from '@angular/core';
import { TransactionsService } from '../../core/services/transactions.service';
import { Subscription } from 'rxjs';
import { Transaction,  } from './interfaces/transactions.interface';
import { TransactionForm } from '../../shared/transaction-form/transaction-form';

@Component({
  imports: [TransactionForm],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit, OnDestroy{

  private sub = new Subscription();
  transactions = signal<Transaction[]>([]);
 
private readonly transactionDialog =
  viewChild.required<ElementRef<HTMLDialogElement>>('transactionDialog');


  constructor(
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.sub.add(
      this.transactionsService.getTransactions({ page: 1, limit: 20 }).subscribe({
        next: (res) => {
          this.transactions.set(res.data.transactions ?? []);
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to load transactions');
          
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
          alert(err?.error?.message || 'Delete failed')
        },
      })
    );
  }

  openTransactionDialog(): void {
  this.transactionDialog().nativeElement.showModal();
  }

  closeTransactionDialog(): void {
    this.transactionDialog().nativeElement.close();
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.transactionDialog().nativeElement) {
      this.closeTransactionDialog();
    }
  }

  onTransactionCreated(): void {
    this.closeTransactionDialog();
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}