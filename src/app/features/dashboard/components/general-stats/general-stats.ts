import { Component, input} from '@angular/core';
import { DashboardSummary } from '../../interfaces/dashboardSummary.interface';

@Component({
  imports: [],
  selector: 'app-general-stats',
  styleUrl: './general-stats.css',
  templateUrl: './general-stats.html',
})
export class GeneralStats {

  data = input.required<DashboardSummary>(); 

}
