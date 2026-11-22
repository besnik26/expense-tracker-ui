import { Component, input, computed } from '@angular/core';
import { DashboardSummary } from '../../interfaces/dashboardSummary.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-spending-progress',
  styleUrl: './spending-progress.css',
  templateUrl: './spending-progress.html',
})
export class SpendingProgress {
  data = input.required<DashboardSummary>(); 

  spendingPercentage = computed(() => {
    const income = this.data().totalIncome;
    const expenses = this.data().totalExpenses;

    if (income <= 0) return 0;

    return Math.round((expenses / income) * 100);
  });

  remainingIncome = computed(() => {
    return this.data().totalIncome - this.data().totalExpenses;
  });

  visualPercentage = computed(() =>
    Math.min(this.spendingPercentage(), 100)
  );

}
