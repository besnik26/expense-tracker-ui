import { Component, signal,output, input, effect, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { 
  TransactionType,
  CreateTransactionDto,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  Transaction

 } from '../../interfaces/transactions.interface';
import { TransactionsService } from '../../../../core/services/transactions.service';
import { toast } from 'ngx-sonner';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-transaction-form',
  styleUrl: './transaction-form.css',
  templateUrl: './transaction-form.html',
})
export class TransactionForm implements OnDestroy{
    private sub = new Subscription();
    loading = signal(false);
    error = signal<string | null>(null);


    readonly mode = input<'add' | 'edit'>('add');
    readonly transaction = input<Transaction | null>(null);

    transactionSaved = output<void>();


    // category options derived from type
    readonly incomeCategories = INCOME_CATEGORIES;
    readonly expenseCategories = EXPENSE_CATEGORIES;

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

      effect(() => {
        const mode = this.mode();
        const transaction = this.transaction();

        if (mode === 'edit' && transaction) {
          this.transactionForm.patchValue({
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date.slice(0, 10),
            description: transaction.description
          });
        } else {
          this.resetForm();
        }
      });
    }

    private resetForm(): void {
      this.transactionForm.reset({
        type: 'expense',
        amount: null,
        category: this.expenseCategories[0],
        date: this.todayString(),
        description: ''
      });
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

          const request$ = this.mode() === 'add'
          ? this.transactionsService.createTransaction(payload)
          : this.transactionsService.updateTransaction(
              this.transaction()!._id,
              payload
            );
            
          this.sub.add(



            request$.subscribe({
              next: ()=>{
                this.loading.set(false);
                this.error.set(null);

                if(this.mode() === 'add'){
                  this.resetForm();
                  toast.success('Successfully created transaction!');
                }else{
                  toast.success('Successfully updated transaction!');
                }
                this.transactionSaved.emit();
              },
              error:(err)=>{
                this.error.set(err?.error?.message || 'Save failed');
                this.loading.set(false);      
                
                toast.error(
                  this.mode() === 'add'
                    ? 'Failed to create transaction!'
                    : 'Failed to update transaction!'
                );
              }
            })



            // this.transactionsService.createTransaction(payload).subscribe({
            //   next: () => {
            //     this.transactionForm.reset({
            //       type: 'expense',
            //       amount: null,
            //       category: this.expenseCategories[0],
            //       date: this.todayString(),
            //       description: '',
            //     });
            //     this.loading.set(false);
            //     this.error.set(null);
            //     this.transactionCreated.emit();
            //     toast.success('Successfully created transaction!')


            //   },
            //   error: (err) => {
            //     this.error.set(err?.error?.message || 'Create failed');
            //     this.loading.set(false);
            //     toast.error('Failed to create Transaction!');
            //   },
            // })
          );
        }

      ngOnDestroy(): void {
        this.sub.unsubscribe();
      }


}
