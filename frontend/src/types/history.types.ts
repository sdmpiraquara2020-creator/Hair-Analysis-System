export interface HistoryEventDTO {
  id: string;
  clientId: string;
  organizationId: string;
  professionalId: string;

  eventType: string;
  referenceId: string;
  summary: string;
  metadata?: Record<string, any>;

  createdAt: string;
}
