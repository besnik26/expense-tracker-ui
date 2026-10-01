import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { DashboardSummary } from './interfaces/dashboardSummary.interface';
import { GeneralStats } from './components/general-stats/general-stats';
import { RecentTransactions } from './components/recent-transactions/recent-transactions';

@Component({
  imports: [GeneralStats, RecentTransactions],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy{
  dashboardData = signal<DashboardSummary | null>(null);
  private destroy$ = new Subject<void>();

  constructor(private dashboardService:DashboardService){}

  ngOnInit(): void {
    this.getDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getDashboard():void{
    this.dashboardService.getDashboard()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.dashboardData.set(response.data);
      },
      error: (err) => {
        console.error('Failed to get Dashboard data:', err);
      }
    })
  }


}
