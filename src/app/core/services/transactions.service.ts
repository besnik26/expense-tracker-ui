import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    ApiResponse,
    TransactionListResponse,
    Transaction,
    CreateTransactionDto,
    UpdateTransactionDto
} from '../../features/transactions/interfaces/transactions.interface'


@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly baseUrl = '/api/transactions';

  private http = inject(HttpClient);

  getTransactions(filters?: {
    month?: string;
    category?: string;
    type?: 'income' | 'expense';
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<TransactionListResponse>> {
    let params = new HttpParams();

    if (filters?.month) params = params.set('month', filters.month);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.page) params = params.set('page', String(filters.page));
    if (filters?.limit) params = params.set('limit', String(filters.limit));

    return this.http.get<ApiResponse<TransactionListResponse>>(`${environment.apiUrl}${this.baseUrl}`, { params });
  }

  getTransactionById(id: string): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${environment.apiUrl}${this.baseUrl}/${id}`);
  }

  createTransaction(data: CreateTransactionDto): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${environment.apiUrl}${this.baseUrl}`, data);
  }

  updateTransaction(
    id: string,
    data: UpdateTransactionDto
  ): Observable<ApiResponse<Transaction>> {
    return this.http.put<ApiResponse<Transaction>>(`${environment.apiUrl}${this.baseUrl}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<ApiResponse<{ id: string }>> {
    return this.http.delete<ApiResponse<{ id: string }>>(`${environment.apiUrl}${this.baseUrl}/${id}`);
  }

  
}

