export function buildClinicalReportPayload(data: {
  clientId: string;
  periodDays: number;
  totalAnalyses: number;
  deltaPercentage: number;
}) {
  return {
    clientId: data.clientId,
    periodDays: data.periodDays,
    totalAnalyses: data.totalAnalyses,
    deltaPercentage: data.deltaPercentage
  };
}
