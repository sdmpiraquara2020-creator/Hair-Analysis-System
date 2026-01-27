import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportDashboardPdf() {
  const element = document.getElementById("dashboard-root");

  if (!element) {
    throw new Error("Elemento do dashboard não encontrado");
  }

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("dashboard.pdf");
}
