import { Component, input } from '@angular/core';
import { DashboardSummary } from '../../interfaces/dashboardSummary.interface';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-recent-transactions',
  styleUrl: './recent-transactions.css',
  templateUrl: './recent-transactions.html',
})
export class RecentTransactions {
    data = input.required<DashboardSummary>(); 
  
}
