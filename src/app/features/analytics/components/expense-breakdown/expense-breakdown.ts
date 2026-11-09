import { Component, input, computed } from '@angular/core';
import { AnalyticsSummary } from '../../interfaces/analyticsSummary.interface';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  imports: [BaseChartDirective],
  selector: 'app-expense-breakdown',
  styleUrl: './expense-breakdown.css',
  templateUrl: './expense-breakdown.html',
})
export class ExpenseBreakdown {
    analyticsData = input.required<AnalyticsSummary>(); 

    pieChartData = computed<ChartData<'pie', number[], string>>(() => {
    const expenses = this.analyticsData().expenseBreakdownAnalytics;

    return {
      labels: expenses.map(item => item._id),
      datasets: [
        {
          data: expenses.map(item => item.totalSpent),
          backgroundColor: [
            '#FF6384', // Pink
            '#36A2EB', // Blue
            '#FFCE56', // Yellow
            '#4BC0C0', // Teal
            '#9966FF', // Purple
            '#FF9F40', // Orange
            '#7BC96F'  // Green
          ],
        }
      ]
    };
  });

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

}
