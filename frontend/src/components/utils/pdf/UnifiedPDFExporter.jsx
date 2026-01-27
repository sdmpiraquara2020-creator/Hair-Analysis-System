import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Garantir que todas as imagens estejam carregadas antes de gerar PDF
async function aguardarCarregamentoImagens(element) {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = resolve; // Continuar mesmo se imagem falhar
      setTimeout(resolve, 3000); // Timeout de segurança
    });
  });
  await Promise.all(promises);
  console.log(`✅ [PDF] ${images.length} imagens carregadas`);
}

/**
 * FUNÇÃO CENTRAL UNIFICADA DE EXPORTAÇÃO DE PDF
 * SDM Analyzer IA - Todos os PDFs devem usar esta função
 */

export const exportarPDF = async (elementRef, fileName, options = {}) => {
  if (!elementRef || !elementRef.current) {
    throw new Error('Referência do elemento não encontrada');
  }

  try {
    const element = elementRef.current;
    
    // Garantir que elemento está visível
    const originalDisplay = element.style.display;
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';

    // Pré-carregar todas as imagens
    const images = element.querySelectorAll('img');
      await Promise.all(
        ensureArray(Array.from(images || [])).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 5000);
          });
        })
      );

    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, 500));

    // Configurações otimizadas
    const config = {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 30000,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.offsetWidth,
      ...options
    };

    // Capturar elemento como canvas
    const canvas = await html2canvas(element, config);
    
    // Restaurar estado original
    element.style.display = originalDisplay;
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    
    // Criar PDF com compressão
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Primeira página
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Adicionar páginas extras se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Salvar PDF
    pdf.save(fileName);

    return { success: true };

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw error;
  }
};

/**
 * FUNÇÃO UNIFICADA E APRIMORADA DE EXPORTAÇÃO PDF
 * Usa html2canvas + jsPDF com carregamento garantido de imagens
 * Suporta paginação automática e alta qualidade
 */
export async function exportarPDFNativo(reportRef, fileName) {
  if (!reportRef?.current) {
    throw new Error('Referência do relatório não encontrada');
  }

  try {
    console.log('📄 [UnifiedPDFExporter] Iniciando exportação...');
    
    const element = reportRef.current;
    
    // Forçar renderização completa
    element.style.visibility = 'visible';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '0';
    element.style.width = '210mm';
    element.style.maxWidth = '210mm';
    
    // CRÍTICO: Aguardar carregamento de todas as imagens
    console.log('⏳ [PDF] Aguardando carregamento de imagens...');
    await aguardarCarregamentoImagens(element);
    
    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('🖼️ [PDF] Capturando canvas...');
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 30000,
      removeContainer: false,
      windowWidth: 794,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-pdf-template]');
        if (clonedElement) {
          clonedElement.style.visibility = 'visible';
          clonedElement.style.position = 'relative';
          clonedElement.style.left = '0';
          clonedElement.style.width = '210mm';
          clonedElement.style.maxWidth = '210mm';
        }
      }
    });

    // Esconder novamente
    element.style.visibility = 'hidden';
    element.style.position = 'fixed';
    element.style.left = '-99999px';

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Dimensões A4
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgHeight / imgWidth;
    const contentHeight = pdfWidth * ratio;
    
    console.log(`📐 [PDF] Dimensões - Conteúdo: ${contentHeight.toFixed(2)}mm`);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      hotfixes: ['px_scaling']
    });

    if (contentHeight <= pdfHeight - 10) {
      console.log('📄 [PDF] Página única');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, contentHeight, '', 'FAST');
    } else {
      console.log('📄 [PDF] Múltiplas páginas...');
      let yPosition = 0;
      let pageCount = 0;
      
      while (yPosition < contentHeight) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        
        const sourceY = (yPosition / contentHeight) * imgHeight;
        const remainingContent = contentHeight - yPosition;
        const pageContentHeight = Math.min(pdfHeight, remainingContent);
        const sourceHeight = (pageContentHeight / contentHeight) * imgHeight;
        
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
        
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageContentHeight, '', 'FAST');
        
        yPosition += pdfHeight;
        pageCount++;
      }
      
      console.log(`📄 [PDF] ${pageCount} páginas geradas`);
    }

    pdf.save(fileName);
    console.log('✅ [UnifiedPDFExporter] PDF salvo');

  } catch (error) {
    console.error('❌ [UnifiedPDFExporter] Erro:', error);
    throw error;
  }
}

/**
 * Exportação via impressão nativa (fallback para desktop)
 */
export const exportarPDFImpressao = (elementRef, fileName) => {
  if (!elementRef || !elementRef.current) {
    throw new Error('Referência do elemento não encontrada');
  }

  try {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      alert('Por favor, permita pop-ups para gerar o relatório.');
      return;
    }

    const htmlContent = elementRef.current.innerHTML;
    
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName.replace('.pdf', '')}</title>
  <style>
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      padding: 20px;
    }
    img {
      max-width: 100%;
      height: auto !important;
      display: block;
    }
    @media print {
      @page { 
        margin: 15mm; 
        size: A4 portrait; 
      }
      body { 
        padding: 0;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact; 
      }
      img {
        page-break-inside: avoid;
      }
    }
    @media screen {
      body {
        max-width: 800px;
        margin: 0 auto;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    window.onload = function() {
      const images = document.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = images.length;
      
      if (totalImages === 0) {
        setTimeout(() => window.print(), 300);
        return;
      }
      
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setTimeout(() => window.print(), 500);
        }
      };
      
      images.forEach(img => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.onload = checkAllLoaded;
          img.onerror = checkAllLoaded;
        }
      });
    };
  </script>
</body>
</html>
`;

    printWindow.document.write(html);
    printWindow.document.close();
  } catch (error) {
    console.error('Erro ao abrir janela de impressão:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

/**
 * FUNÇÃO AUTO - SEMPRE USA MÉTODO NATIVO UNIFICADO
 * Garante consistência em todos os dispositivos
 */
export const exportarPDFAuto = async (elementRef, fileName, options = {}) => {
  console.log('📄 [PDF] Usando método nativo unificado para todos os dispositivos');
  return await exportarPDFNativo(elementRef, fileName);
};

export default { exportarPDFNativo, exportarPDFImpressao, exportarPDFAuto };

