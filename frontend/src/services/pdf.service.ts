import jsPDF from "jspdf";

interface PdfData {
  clientName: string;
  professionalName: string;
  diagnosis: string;
  recommendation: string;
  createdAt: string;
}

export function generateClinicalPdf(data: PdfData) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SDM Analyzer IA", 20, 20);

  doc.setFontSize(12);
  doc.text("Relatório Clínico Capilar", 20, 30);

  doc.line(20, 33, 190, 33);

  doc.text(`Cliente: ${data.clientName}`, 20, 45);
  doc.text(`Profissional: ${data.professionalName}`, 20, 55);
  doc.text(`Data: ${data.createdAt}`, 20, 65);

  doc.line(20, 70, 190, 70);

  doc.setFontSize(13);
  doc.text("Diagnóstico", 20, 85);
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(data.diagnosis, 170), 20, 95);

  doc.setFontSize(13);
  doc.text("Recomendação", 20, 120);
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(data.recommendation, 170), 20, 130);

  doc.line(20, 200, 100, 200);
  doc.text("Assinatura Profissional", 20, 210);

  doc.save(`relatorio_clinico_${data.clientName}.pdf`);
}
