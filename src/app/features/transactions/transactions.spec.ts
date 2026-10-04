import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TransactionsService } from '../../core/services/transactions.service';
import { ApiResponse, Transaction, TransactionListResponse } from './interfaces/transactions.interface';
import { Transactions } from './transactions';

describe('Transactions', () => {
  let component: Transactions;
  let fixture: ComponentFixture<Transactions>;
  let getTransactions: ReturnType<typeof vi.fn>;

  const response: ApiResponse<TransactionListResponse> = {
    success: true,
    data: {
      transactions: [],
      pagination: {
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
      },
    },
  };

  beforeEach(async () => {
    getTransactions = vi.fn(() => of(response));

    await TestBed.configureTestingModule({
      imports: [Transactions],
      providers: [{
        provide: TransactionsService,
        useValue: {
          getTransactions,
          deleteTransaction: vi.fn(() => of({ success: true, data: { id: '1' } })),
          createTransaction: vi.fn(),
          updateTransaction: vi.fn(),
          getTransactionById: vi.fn(),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(Transactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an empty-results message when the API returns no transactions', () => {
    expect(fixture.nativeElement.textContent).toContain('No transactions yet.');

    component.category.set('Food');
    component.applyFilters();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No transactions match these filters.');
  });

  it('requests combined filters from page one and syncs pagination from the response', () => {
    component.month.set('2026-10');
    component.category.set('Food');
    component.type.set('expense');
    component.page.set(3);

    component.applyFilters();

    expect(getTransactions).toHaveBeenLastCalledWith({
      month: '2026-10',
      category: 'Food',
      type: 'expense',
      page: 1,
      limit: 10,
    });
    expect(component.page()).toBe(response.data.pagination.currentPage);
    expect(component.pagination()).toEqual(response.data.pagination);
  });

  it('renders transactions and adopts the pagination returned by the API', () => {
    const transaction: Transaction = {
      _id: 'transaction-1',
      userId: 'user-1',
      type: 'expense',
      amount: 12,
      category: 'Food',
      date: '2026-10-01',
      description: 'Lunch',
    };
    const apiPagination = {
      currentPage: 2,
      limit: 10,
      totalItems: 15,
      totalPages: 2,
    };
    getTransactions.mockReturnValueOnce(of({
      success: true,
      data: {
        transactions: [transaction],
        pagination: apiPagination,
      },
    }));

    component.loadTransactions();
    fixture.detectChanges();

    expect(component.transactions()).toEqual([transaction]);
    expect(component.pagination()).toEqual(apiPagination);
    expect(component.page()).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Lunch');
  });

  it('uses the existing category options and exposes All choices', () => {
    const categorySelect: HTMLSelectElement =
      fixture.nativeElement.querySelector('#transaction-category');
    const typeSelect: HTMLSelectElement =
      fixture.nativeElement.querySelector('#transaction-type');

    expect(Array.from(categorySelect.options).map((option) => option.value)).toEqual([
      '',
      'Salary',
      'Freelance',
      'Gift',
      'Bonus',
      'Investment',
      'Other',
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Entertainment',
      'Health',
    ]);
    expect(categorySelect.options[0].textContent).toBe('All');
    expect(typeSelect.options[0].textContent).toBe('All');
  });

  it('clears all filters and returns to page one', () => {
    component.month.set('2026-10');
    component.category.set('Food');
    component.type.set('expense');
    component.page.set(2);

    component.clearFilters();

    expect(getTransactions).toHaveBeenLastCalledWith({
      month: undefined,
      category: undefined,
      type: undefined,
      page: 1,
      limit: 10,
    });
    expect(component.hasActiveFilters()).toBe(false);
  });

  it('shows an accessible error and retry action when loading fails', () => {
    getTransactions.mockReturnValueOnce(throwError(() => new Error('Network error')));

    component.loadTransactions();
    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Failed to load transactions');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });
});
