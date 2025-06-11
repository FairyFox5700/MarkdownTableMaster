import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Code } from 'lucide-react';
import type { TableData, TableStyles } from '@/types/table-styles';
import { useState } from 'react';

interface TablePreviewProps {
  tableData: TableData | null;
  styles: TableStyles;
}

export function TablePreview({ tableData, styles }: TablePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');

  if (!tableData || !tableData.headers.length) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enter a markdown table to see the preview</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTableStyles = (): React.CSSProperties => ({
    fontFamily: styles.fontFamily,
    fontSize: `${styles.fontSize}px`,
    color: styles.textColor,
    backgroundColor: styles.backgroundColor,
    borderColor: styles.borderColor,
    borderStyle: styles.borderStyle,
    borderWidth: styles.borderStyle === 'none' ? 0 : `${styles.borderWidth}px`,
    borderCollapse: 'collapse' as const,
    width: '100%',
    borderRadius: styles.roundedCorners ? '8px' : '0',
    overflow: styles.roundedCorners ? 'hidden' : 'visible',
  });

  const getCellStyles = (isHeader: boolean = false): React.CSSProperties => ({
    padding: `${styles.cellPadding}px`,
    textAlign: styles.textAlignment,
    borderColor: styles.borderColor,
    borderStyle: styles.borderStyle,
    borderWidth: styles.borderStyle === 'none' ? 0 : `${styles.borderWidth}px`,
    backgroundColor: isHeader && styles.headerStyling ? styles.headerColor : 'inherit',
    fontWeight: isHeader && styles.headerStyling ? 600 : 'normal',
    textTransform: isHeader && styles.headerStyling ? 'uppercase' : 'none',
    fontSize: isHeader && styles.headerStyling ? '0.75rem' : 'inherit',
    letterSpacing: isHeader && styles.headerStyling ? '0.05em' : 'normal',
  });

  const getRowStyles = (index: number): React.CSSProperties => ({
    backgroundColor: styles.stripedRows && index % 2 === 1 ? 
      `${styles.backgroundColor}dd` : 'inherit',
    ...(styles.hoverEffects && {
      transition: 'background-color 0.15s ease-in-out',
    })
  });

  const generateHTML = () => {
    const tableStyles = getTableStyles();
    const cellStyles = getCellStyles();
    
    return `<table style="${Object.entries(tableStyles).map(([key, value]) => 
      `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}">
  <thead>
    <tr>
      ${tableData.headers.map(header => 
        `<th style="${Object.entries(getCellStyles(true)).map(([key, value]) => 
          `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}">${header}</th>`
      ).join('\n      ')}
    </tr>
  </thead>
  <tbody>
    ${tableData.rows.map((row, index) => 
      `<tr${styles.stripedRows ? ` style="background-color: ${index % 2 === 1 ? styles.backgroundColor + 'dd' : 'inherit'}"` : ''}>
      ${row.map(cell => 
        `<td style="${Object.entries(cellStyles).map(([key, value]) => 
          `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}">${cell}</td>`
      ).join('\n      ')}
    </tr>`
    ).join('\n    ')}
  </tbody>
</table>`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Live Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant={viewMode === 'html' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('html')}
            >
              <Code className="w-4 h-4 mr-2" />
              HTML
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'preview' ? (
          <div id="table-preview" className="overflow-x-auto">
            <table 
              style={getTableStyles()}
              className={styles.hoverEffects ? 'hover-enabled' : ''}
            >
              <thead>
                <tr>
                  {tableData.headers.map((header, index) => (
                    <th key={index} style={getCellStyles(true)}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} style={getRowStyles(rowIndex)}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={getCellStyles()}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm font-mono whitespace-pre-wrap break-all">
              {generateHTML()}
            </pre>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        .hover-enabled tbody tr:hover {
          background-color: ${styles.backgroundColor}bb !important;
        }
      `}</style>
    </Card>
  );
}
