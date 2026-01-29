export interface TechnicalSummaryData {
  hairType: string;
  thickness: string;
  volume: string;
  elasticity: string;
  porosity: string;
  damageLevel: string;
}

export interface ServiceRecommendation {
  name: string;
  reason: string;
  benefits: string[];
}

export interface AlertItem {
  message: string;
}

export interface ScheduleStep {
  week: string;
  treatment: string;
  objective: string;
}
