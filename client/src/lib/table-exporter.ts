import html2canvas from 'html2canvas';
import type { TableData, ExportSettings } from '@/types/table-styles';

export async function exportTableAsPNG(
  tableElement: HTMLElement,
  settings: ExportSettings,
  filename: string = 'table'
): Promise<void> {
  try {
    // Determine if we're exporting from the expanded dialog
    const isExpanded = tableElement.closest('#expanded-table-preview') !== null;
    
    // Set DPI based on quality setting - higher for expanded view
    const dpi = settings.quality === 'high' ? (isExpanded ? 300 : 240) : 
                settings.quality === 'medium' ? (isExpanded ? 200 : 150) : 
                (isExpanded ? 120 : 72);
                
    const scale = dpi / 96; // 96 is default DPI
    
    // Create a clone of the table in memory for proper rendering
    const tableClone = tableElement.cloneNode(true) as HTMLElement;
    const containerDiv = document.createElement('div');
    
    // Set container styles for better rendering
    containerDiv.style.position = 'absolute';
    containerDiv.style.left = '-9999px';
    containerDiv.style.top = '-9999px';
    containerDiv.style.width = 'auto';
    containerDiv.style.height = 'auto';
    containerDiv.style.padding = '20px';
    containerDiv.style.backgroundColor = settings.background === 'transparent' ? 'transparent' : 
                                         settings.background === 'white' ? '#FFFFFF' : 
                                         settings.customBackground || '#FFFFFF';
    
    // Ensure table has width: auto to capture full size
    const tableElementStyle = (tableClone as HTMLElement).style;
    tableElementStyle.width = 'auto';
    tableElementStyle.maxWidth = 'none';
    
    // Add to DOM temporarily
    containerDiv.appendChild(tableClone);
    document.body.appendChild(containerDiv);
    
    // Capture the image
    const canvas = await html2canvas(containerDiv, {
      backgroundColor: settings.background === 'transparent' ? null : 
                      settings.background === 'white' ? '#FFFFFF' : 
                      settings.customBackground || '#FFFFFF',
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    // Clean up
    document.body.removeChild(containerDiv);
    
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
    // Determine if we're exporting from the expanded dialog
    const isExpanded = tableElement.closest('#expanded-table-preview') !== null;
    
    // Higher scale for better quality
    const scale = isExpanded ? 3 : 2;
    
    // Create a clone of the table in memory for proper rendering
    const tableClone = tableElement.cloneNode(true) as HTMLElement;
    const containerDiv = document.createElement('div');
    
    // Set container styles for better rendering
    containerDiv.style.position = 'absolute';
    containerDiv.style.left = '-9999px';
    containerDiv.style.top = '-9999px';
    containerDiv.style.width = 'auto';
    containerDiv.style.height = 'auto';
    containerDiv.style.padding = '20px';
    containerDiv.style.backgroundColor = '#FFFFFF';
    
    // Ensure table has width: auto to capture full size
    const tableElementStyle = (tableClone as HTMLElement).style;
    tableElementStyle.width = 'auto';
    tableElementStyle.maxWidth = 'none';
    
    // Add to DOM temporarily
    containerDiv.appendChild(tableClone);
    document.body.appendChild(containerDiv);
    
    const canvas = await html2canvas(containerDiv, {
      backgroundColor: '#FFFFFF',
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    // Clean up
    document.body.removeChild(containerDiv);
    
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
