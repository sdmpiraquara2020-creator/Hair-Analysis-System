// frontend/src/adapters/dashboardAdapter.ts
export default function dashboardAdapter(raw: any) {
  return {
    kpis: {
      totalAnalyses: raw?.totalAnalyses ?? 0,
      activeClients: raw?.activeClients ?? 0,
      averageEvolution: raw?.averageEvolution ?? 0,
      activeAlerts: raw?.activeAlerts ?? 0,
      trichologyAnalyses: raw?.trichologyAnalyses ?? 0,
    },
    recentAnalyses: Array.isArray(raw?.recentAnalyses)
      ? raw.recentAnalyses.map((r: any) => ({
          id: r.id,
          clientName: r.clientName,
          analysisTypeLabel:
            r.analysisType === 'TRICOLOGICA' ? 'Tricológica' : 'Capilar',
          dateLabel: new Date(r.createdAt).toLocaleDateString('pt-BR'),
          status:
            r.status === 'ALERTA'
              ? 'danger'
              : r.status === 'ATENCAO'
              ? 'warning'
              : 'success',
        }))
      : [],
  };
}
