import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { takeUntil, Subject } from 'rxjs';
import { AnalyticsSummary } from './interfaces/analyticsSummary.interface';
import { TotalStats } from './components/total-stats/total-stats';

@Component({
  imports: [TotalStats],
  selector: 'app-analytics',
  styleUrl: './analytics.css',
  templateUrl: './analytics.html',
})
export class Analytics implements OnInit, OnDestroy{
  analyticsData = signal<AnalyticsSummary | null>(null);
  private destroy$ = new Subject<void>();
  


  constructor (private analyticsService:AnalyticsService){}

  ngOnInit(): void {
    this.getAnalytics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getAnalytics():void{
    this.analyticsService.getAnalytics()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response)=>{
        this.analyticsData.set(response.data);
      },
      error:(err)=>{
        console.error('Failed to get Analytics data:', err);
      }
    })
  }

}
