// Utilitário para exportar PDF de um elemento HTML usando html2pdf.js
// Instale html2pdf.js via npm: npm install html2pdf.js
import html2pdf from 'html2pdf.js';

export async function exportarPDFNativo(ref, fileName = 'relatorio.pdf') {
  if (!ref || !ref.current) {
    throw new Error('Ref do elemento não encontrada');
  }
  const element = ref.current;
  const opt = {
    margin:       0.5,
    filename:     fileName,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  await html2pdf().set(opt).from(element).save();
}
