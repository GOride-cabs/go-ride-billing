import html2pdf from 'html2pdf.js';

export async function downloadInvoicePdf(elementId, filename = 'GoRide-Trip-Invoice.pdf') {
  let element = document.getElementById(elementId);
  if (!element) {
    // If not found by ID, try offscreen printable element
    element = document.getElementById('invoice-printable-offscreen');
  }

  if (!element) {
    console.warn('Invoice element not found, falling back to window.print()');
    window.print();
    return;
  }

  // Configure high-resolution, clean single-page A4 PDF options
  const opt = {
    margin: [6, 8, 6, 8], // [top, left, bottom, right] in mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2.4, // Ultra-crisp retina clarity
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 800,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    },
    pagebreak: { mode: ['avoid-all', 'css'] },
  };

  try {
    // Ensure element has standard fixed printable width during capture
    const prevWidth = element.style.width;
    const prevMaxWidth = element.style.maxWidth;
    const prevTransform = element.style.transform;
    const prevTransformOrigin = element.style.transformOrigin;

    element.style.width = '780px';
    element.style.maxWidth = '780px';
    element.style.transform = 'none';
    element.style.transformOrigin = 'top left';

    await html2pdf().set(opt).from(element).save();

    // Restore styling
    element.style.width = prevWidth;
    element.style.maxWidth = prevMaxWidth;
    element.style.transform = prevTransform;
    element.style.transformOrigin = prevTransformOrigin;
  } catch (err) {
    console.error('html2pdf generation error, falling back to print dialog:', err);
    window.print();
  }
}

