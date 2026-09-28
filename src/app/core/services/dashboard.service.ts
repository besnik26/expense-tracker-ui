import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardResponse } from '../../features/dashboard/interfaces/dashboardResponse.interface';


@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard():Observable<DashboardResponse>{
    return this.http.get<DashboardResponse>(
        `${environment.apiUrl}/api/dashboard`
    )
  }
}