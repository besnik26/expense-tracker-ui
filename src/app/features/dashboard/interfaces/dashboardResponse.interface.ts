import { DashboardSummary } from "./dashboardSummary.interface";

export interface DashboardResponse {
  success: boolean;
  data: DashboardSummary;
}