import { Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsSummary } from '../../interfaces/analyticsSummary.interface';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  imports: [BaseChartDirective],
  selector: 'app-monthly-expenses',
  styleUrl: './monthly-expenses.css',
  templateUrl: './monthly-expenses.html',
})
export class MonthlyExpenses {
  analyticsData = input.required<AnalyticsSummary>(); 


  barChartData = computed<ChartData<'bar',number[],string>>(()=>{
    const analytics = this.analyticsData().monthlyAnalytics;

    return {
      labels:analytics.map(item => item.month),

      datasets: [
        {
          label: 'Income',
          data: analytics.map(item => item.totalIncome),
          backgroundColor: '#D4AF5A',
          borderRadius: 5,
        },
        {
          label: 'Expenses',
          data: analytics.map(item => item.totalExpenses),
          backgroundColor: '#64748B',
          borderRadius: 5,
        },
      ],
    }
  })

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    }
  }
  


}
