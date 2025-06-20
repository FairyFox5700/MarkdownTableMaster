import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Image, 
  Copy, 
  Code, 
  FileSpreadsheet, 
  Download,
  Maximize2
} from 'lucide-react';
import type { TableData, ExportSettings, TableStyles } from '@/types/table-styles';
import { DEFAULT_STYLES } from '@/types/table-styles';
import { 
  exportTableAsPNG, 
  copyTableAsImage, 
  exportTableAsHTML, 
  exportTableAsCSV
} from '@/lib/table-exporter';
import { useState } from 'react';

interface ExportPanelProps {
  tableData: TableData | null;
  styles?: TableStyles;
}

export function ExportPanel({ tableData, styles }: ExportPanelProps) {
  const { toast } = useToast();
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    quality: 'high',
    background: 'white',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = async (type: string, fromDialog: boolean = false) => {
    // Get table element from either the dialog (expanded) or the preview
    const tableElement = fromDialog 
      ? document.getElementById('expanded-table-preview')?.querySelector('table') 
      : document.getElementById('table-preview')?.querySelector('table');
    
    if (!tableElement) {
      toast({
        title: "Error",
        description: "No table found to export. Please create a table first.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      switch (type) {
        case 'png':
          await exportTableAsPNG(tableElement, exportSettings);
          toast({
            title: "Success",
            description: "PNG export completed successfully!",
          });
          break;
        case 'copy-image':
          await copyTableAsImage(tableElement);
          toast({
            title: "Success",
            description: "Table copied to clipboard as image!",
          });
          break;
        case 'html':
          exportTableAsHTML(tableElement);
          toast({
            title: "Success",
            description: "HTML code copied to clipboard!",
          });
          break;
        case 'csv':
          if (tableData) {
            exportTableAsCSV(tableData);
            toast({
              title: "Success",
              description: "CSV file downloaded successfully!",
            });
          }
          break;
        default:
          toast({
            title: "Info",
            description: "Feature coming soon!",
          });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Export failed",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={() => handleExport('png')}
              disabled={isExporting}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <Image className="w-4 h-4 mr-2 text-muted-foreground" />
              Download PNG
            </Button>
            <Button
              onClick={() => setIsDialogOpen(true)}
              disabled={isExporting}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <Maximize2 className="w-4 h-4 mr-2 text-muted-foreground" />
              Expanded Export
            </Button>
            <Button
              onClick={() => handleExport('copy-image')}
              disabled={isExporting}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2 text-muted-foreground" />
              Copy as Image
            </Button>
            <Button
              onClick={() => handleExport('html')}
              disabled={isExporting}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <Code className="w-4 h-4 mr-2 text-muted-foreground" />
              Export HTML
            </Button>
            <Button
              onClick={() => handleExport('csv')}
              disabled={isExporting || !tableData}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-muted-foreground" />
              Export CSV
            </Button>
          </div>

          {/* Export Settings */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-4">Export Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Image Quality</Label>
                <Select 
                  value={exportSettings.quality} 
                  onValueChange={(value: any) => setExportSettings(prev => ({ ...prev, quality: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (300 DPI)</SelectItem>
                    <SelectItem value="medium">Medium (150 DPI)</SelectItem>
                    <SelectItem value="low">Low (72 DPI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Background</Label>
                <Select 
                  value={exportSettings.background} 
                  onValueChange={(value: any) => setExportSettings(prev => ({ ...prev, background: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                    <SelectItem value="custom">Custom Color</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col">
          <Button
            size="lg"
            onClick={() => handleExport('png')}
            disabled={isExporting}
            className="rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            title="Quick Export as PNG"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Expanded Table Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expanded Table Export</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-white rounded-md p-4 mb-4" id="expanded-table-preview">
              {tableData && styles && (
                <table 
                  style={{
                    fontFamily: styles.fontFamily,
                    fontSize: `${styles.fontSize}px`,
                    color: styles.textColor,
                    backgroundColor: styles.backgroundColor,
                    borderColor: styles.borderColor,
                    borderStyle: styles.borderStyle,
                    borderWidth: styles.borderStyle === 'none' ? 0 : `${styles.borderWidth}px`,
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    width: '100%',
                    ...(styles.roundedCorners && { 
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }),
                  }}
                  className={styles.hoverEffects ? 'hover-expanded-enabled' : ''}
                >
                  <thead>
                    <tr>
                      {tableData.headers.map((header, index) => {
                        // Calculate header cell styles with proper rounded corners
                        const isFirstCell = index === 0;
                        const isLastCell = index === tableData.headers.length - 1;
                        const isFirstRow = true;
                        const isLastRow = tableData.rows.length === 0;
                        
                        return (
                          <th key={index} style={{
                            padding: `${styles.cellPadding}px`,
                            textAlign: styles.textAlignment as "left" | "center" | "right",
                            borderColor: styles.borderColor,
                            borderStyle: styles.borderStyle,
                            borderWidth: styles.borderStyle === 'none' ? 0 : `${styles.borderWidth}px`,
                            backgroundColor: styles.headerStyling ? styles.headerColor : 'inherit',
                            fontWeight: styles.headerStyling ? 600 : 'normal',
                            textTransform: styles.headerStyling ? 'uppercase' : 'none',
                            fontSize: styles.headerStyling ? '0.75rem' : 'inherit',
                            letterSpacing: styles.headerStyling ? '0.05em' : 'normal',
                            ...(styles.roundedCorners && isFirstRow && isFirstCell ? { borderTopLeftRadius: '8px' } : {}),
                            ...(styles.roundedCorners && isFirstRow && isLastCell ? { borderTopRightRadius: '8px' } : {}),
                            ...(styles.roundedCorners && isLastRow && isFirstCell ? { borderBottomLeftRadius: '8px' } : {}),
                            ...(styles.roundedCorners && isLastRow && isLastCell ? { borderBottomRightRadius: '8px' } : {})
                          }}>
                            {header}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row, rowIndex) => {
                      const isLastRow = rowIndex === tableData.rows.length - 1;
                      
                      return (
                        <tr key={rowIndex} style={{
                          backgroundColor: styles.stripedRows && rowIndex % 2 === 1 ? 
                            `${styles.backgroundColor}dd` : 'inherit',
                          ...(styles.hoverEffects && {
                            transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                          })
                        }}>
                          {row.map((cell, cellIndex) => {
                            const isFirstCell = cellIndex === 0;
                            const isLastCell = cellIndex === row.length - 1;
                            
                            return (
                              <td key={cellIndex} style={{
                                padding: `${styles.cellPadding}px`,
                                textAlign: styles.textAlignment as "left" | "center" | "right",
                                borderColor: styles.borderColor,
                                borderStyle: styles.borderStyle,
                                borderWidth: styles.borderStyle === 'none' ? 0 : `${styles.borderWidth}px`,
                                ...(styles.roundedCorners && isLastRow && isFirstCell ? { borderBottomLeftRadius: '8px' } : {}),
                                ...(styles.roundedCorners && isLastRow && isLastCell ? { borderBottomRightRadius: '8px' } : {})
                              }}>
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleExport('png', true);
                  setIsDialogOpen(false);
                }}
                disabled={isExporting}
              >
                Download PNG
              </Button>
              <Button
                onClick={() => {
                  handleExport('copy-image', true);
                  setIsDialogOpen(false);
                }}
                disabled={isExporting}
                variant="secondary"
              >
                Copy as Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hover effects styling for expanded table */}
      {styles?.hoverEffects && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .hover-expanded-enabled tbody tr:hover {
              background-color: ${styles.backgroundColor}bb !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              transform: translateY(-1px);
            }
            .hover-expanded-enabled tbody tr {
              transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
            }
          `
        }} />
      )}
    </div>
  );
}
