import { Component, signal,output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionsService } from '../../core/services/transactions.service';
import { Subscription } from 'rxjs';
import { TransactionType, CreateTransactionDto } from '../../features/transactions/interfaces/transactions.interface';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-transaction-form',
  styleUrl: './transaction-form.css',
  templateUrl: './transaction-form.html',
})
export class TransactionForm implements  OnDestroy{
    private sub = new Subscription();
    loading = signal(false);
    error = signal<string | null>(null);

    transactionCreated = output<void>();


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
      private fb:FormBuilder,
      private transactionsService:TransactionsService
    ){
      this.transactionForm = this.fb.group({
        type: ['expense', Validators.required],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        category: [null, Validators.required],
        date: [this.todayString(), Validators.required],
        description: [''],
      });

      this.listenToTypeChanges();
    }


    private todayString(): string {
      return new Date().toISOString().slice(0, 10);
    }

    getCategoriesByType(type: TransactionType): readonly string[] {
      return type === 'income' ? this.incomeCategories : this.expenseCategories;
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
                this.loading.set(false);
                this.error.set(null);
                this.transactionCreated.emit();


              },
              error: (err) => {
                this.error.set(err?.error?.message || 'Create failed');
                this.loading.set(false);
              },
            })
          );
        }

      ngOnDestroy(): void {
        this.sub.unsubscribe();
      }


}
