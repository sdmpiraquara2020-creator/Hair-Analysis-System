interface ExportResultadoCapilarOptions {
  fileName?: string;
}

export function exportResultadoCapilarPDF(
  options?: ExportResultadoCapilarOptions
): void {
  const originalTitle = document.title;

  document.title =
    options?.fileName ?? "resultado-analise-capilar";

  window.print();

  document.title = originalTitle;
}
