// frontend/src/utils/exportClinicalReportPdf.ts
import jsPDF from "jspdf";
import QRCode from "qrcode";

interface ClinicalReportPdfInput {
  reportId: string;
  clientName: string;
  createdAt: string;
  summary: {
    hairHealthScore: number;
    scalpHealthScore?: number;
    alerts: string[];
  };
  professional?: {
    name: string;
    document?: string | null;
  };
  signature?: {
    signedAt: string;
    qrCodeUrl: string;
    signatureHash: string;
  };
}

export async function exportClinicalReportPdf(
  data: ClinicalReportPdfInput
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const sectionTitle = (title: string) => {
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text(title, 20, y);
    y += 6;
    doc.setDrawColor(229, 231, 235);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;
  };

  const labelValue = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(label, 20, y);
    doc.setTextColor(17, 24, 39);
    doc.text(value, 80, y);
    y += 6;
  };

  doc.setFontSize(20);
  doc.setTextColor(17, 24, 39);
  doc.text("Relatório Clínico Capilar", 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(
    "Documento técnico gerado pelo SDM Analyzer IA",
    20,
    y
  );
  y += 14;

  sectionTitle("Identificação");
  labelValue("Cliente", data.clientName);
  labelValue(
    "Data da análise",
    new Date(data.createdAt).toLocaleDateString()
  );
  labelValue("ID do relatório", data.reportId);

  y += 6;
  sectionTitle("Resumo Técnico");

  labelValue(
    "Saúde do fio",
    `${data.summary.hairHealthScore}/100`
  );

  if (data.summary.scalpHealthScore !== undefined) {
    labelValue(
      "Saúde do couro cabeludo",
      `${data.summary.scalpHealthScore}/100`
    );
  }

  if (data.summary.alerts.length > 0) {
    y += 4;
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("Alertas Clínicos", 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    data.summary.alerts.forEach((alert) => {
      doc.text(`• ${alert}`, 22, y);
      y += 5;
    });
  }

  if (data.signature && data.professional) {
    y += 8;
    sectionTitle("Assinatura Profissional");

    labelValue(
      "Profissional",
      data.professional.name
    );

    if (data.professional.document) {
      labelValue(
        "Documento",
        data.professional.document
      );
    }

    labelValue(
      "Assinado em",
      new Date(
        data.signature.signedAt
      ).toLocaleString()
    );

    const qrCodeDataUrl = await QRCode.toDataURL(
      data.signature.qrCodeUrl,
      { margin: 1, width: 120 }
    );

    doc.addImage(
      qrCodeDataUrl,
      "PNG",
      pageWidth - 60,
      y - 28,
      40,
      40
    );

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      "Validação digital",
      pageWidth - 60,
      y + 14
    );
  }

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    "Este relatório não substitui avaliação dermatológica. Uso profissional.",
    20,
    285
  );

  doc.save(
    `relatorio-clinico-${data.clientName
      .replace(/\s+/g, "-")
      .toLowerCase()}.pdf`
  );
}
