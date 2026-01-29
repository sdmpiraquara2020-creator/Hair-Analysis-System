import { DashboardSummaryDTO } from "../types/dashboard";

export function mapDistributionToChart(
  timeline: DashboardSummaryDTO["timeline"]
) {
  return timeline.map(item => ({
    label: item.date,
    value: item.total,
  }));
}
