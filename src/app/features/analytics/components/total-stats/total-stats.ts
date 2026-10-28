import { Component,input } from '@angular/core';
import { AnalyticsSummary } from '../../interfaces/analyticsSummary.interface';

@Component({
  imports: [],
  selector: 'app-total-stats',
  styleUrl: './total-stats.css',
  templateUrl: './total-stats.html',
})
export class TotalStats {
    data = input.required<AnalyticsSummary>(); 

}
