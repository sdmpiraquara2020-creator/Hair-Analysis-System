export interface DashboardSummaryDTO {
  summary: {
    total: number;
    previous: number;
    variation: number;
  };
  timeline: {
    date: string;
    total: number;
  }[];
}
