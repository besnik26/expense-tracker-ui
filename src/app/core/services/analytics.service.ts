import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalyticsResponse } from '../../features/analytics/interfaces/analyticsResponse.interface';


@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getAnalytics():Observable<AnalyticsResponse>{
    return this.http.get<AnalyticsResponse>(`${environment.apiUrl}/api/analytics`)
  }
  

}