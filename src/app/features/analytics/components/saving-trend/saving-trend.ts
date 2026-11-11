import { Component, input, computed} from '@angular/core';
import { AnalyticsSummary } from '../../interfaces/analyticsSummary.interface';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  imports: [BaseChartDirective],
  selector: 'app-saving-trend',
  styleUrl: './saving-trend.css',
  templateUrl: './saving-trend.html',
})
export class SavingTrend {
  analyticsData = input.required<AnalyticsSummary>(); 

  lineChartData = computed<ChartData<'line'>>(() => {
    const savings = this.analyticsData().savingTrendAnalytics;

    return {
      labels: savings.map(item => item.month),
      datasets: [
        {
          label: 'Net Savings',
          data: savings.map(item => item.netSavings),
          borderColor: '#D4AF5A',
          backgroundColor: 'rgba(212, 175, 90, 0.15)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  });

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `€${value}`,
        },
      },
    },
  };
}
