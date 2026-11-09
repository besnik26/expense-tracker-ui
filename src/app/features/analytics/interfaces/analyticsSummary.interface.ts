import { ExpenseBreakdown } from "./expenseBreakdown.inteface";
import { MonthlyAnalytics } from "./monthlyAnalytics.interface";

export interface AnalyticsSummary{
    totalIncome:number;
    totalExpenses:number;
    totalBalance:number;
    monthlyAnalytics: MonthlyAnalytics[];
    expenseBreakdownAnalytics: ExpenseBreakdown[];
}