import html2canvas from 'html2canvas';
import type { TableData, ExportSettings } from '@/types/table-styles';

export async function exportTableAsPNG(
  tableElement: HTMLElement,
  settings: ExportSettings,
  filename: string = 'table'
): Promise<void> {
  try {
    const dpi = settings.quality === 'high' ? 300 : settings.quality === 'medium' ? 150 : 72;
    const scale = dpi / 96; // 96 is default DPI
    
    const canvas = await html2canvas(tableElement, {
      backgroundColor: settings.background === 'transparent' ? null : 
                      settings.background === 'white' ? '#FFFFFF' : 
                      settings.customBackground || '#FFFFFF',
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting table as PNG:', error);
    throw new Error('Failed to export table as PNG');
  }
}

export async function copyTableAsImage(tableElement: HTMLElement): Promise<void> {
  try {
    const canvas = await html2canvas(tableElement, {
      backgroundColor: '#FFFFFF',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    canvas.toBlob(async (blob) => {
      if (blob && navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        } catch (error) {
          console.error('Error copying to clipboard:', error);
          throw new Error('Failed to copy image to clipboard');
        }
      } else {
        throw new Error('Clipboard API not supported');
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error copying table as image:', error);
    throw new Error('Failed to copy table as image');
  }
}

export function exportTableAsHTML(tableElement: HTMLElement): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Table</title>
    <style>
        body { font-family: Inter, sans-serif; margin: 20px; }
        ${getComputedCSS(tableElement)}
    </style>
</head>
<body>
    ${tableElement.outerHTML}
</body>
</html>`;
  
  copyToClipboard(htmlContent);
}

export function exportTableAsCSV(tableData: TableData): void {
  const csvContent = [
    tableData.headers.join(','),
    ...tableData.rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.download = 'table.csv';
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateEmbedCode(tableElement: HTMLElement): void {
  const embedCode = `<div style="overflow-x: auto;">
${tableElement.outerHTML}
</div>

<style>
${getComputedCSS(tableElement)}
</style>`;
  
  copyToClipboard(embedCode);
}

function getComputedCSS(element: HTMLElement): string {
  const styles = window.getComputedStyle(element);
  let cssText = '';
  
  // Extract relevant styles
  const relevantProps = [
    'font-family', 'font-size', 'color', 'background-color',
    'border', 'border-collapse', 'padding', 'text-align'
  ];
  
  relevantProps.forEach(prop => {
    const value = styles.getPropertyValue(prop);
    if (value) {
      cssText += `${prop}: ${value};\n`;
    }
  });
  
  return `table { ${cssText} width: 100%; }
table th, table td { padding: inherit; border: inherit; text-align: inherit; }
table th { background-color: inherit; font-weight: 600; }`;
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(error => {
    console.error('Error copying to clipboard:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  });
}
