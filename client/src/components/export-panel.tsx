import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Image, 
  Copy, 
  Code, 
  FileSpreadsheet, 
  Download,
  Heart,
  Plus,
  PlusSquare,
  ArrowUpDown,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import type { TableData, ExportSettings } from '@/types/table-styles';
import { 
  exportTableAsPNG, 
  copyTableAsImage, 
  exportTableAsHTML, 
  exportTableAsCSV,
  generateEmbedCode 
} from '@/lib/table-exporter';
import { useState } from 'react';

interface ExportPanelProps {
  tableData: TableData | null;
}

export function ExportPanel({ tableData }: ExportPanelProps) {
  const { toast } = useToast();
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    quality: 'high',
    background: 'white',
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: string) => {
    const tableElement = document.getElementById('table-preview')?.querySelector('table');
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
        case 'embed':
          generateEmbedCode(tableElement);
          toast({
            title: "Success",
            description: "Embed code generated and copied!",
          });
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

  const handleQuickAction = (action: string) => {
    toast({
      title: "Info",
      description: `${action} feature coming soon!`,
    });
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
            <Button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-muted-foreground" />
              Export Excel
            </Button>
            <Button
              onClick={() => handleExport('embed')}
              disabled={isExporting}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <Code className="w-4 h-4 mr-2 text-muted-foreground" />
              Embed Code
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

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('Add Row')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('Add Column')}
            >
              <PlusSquare className="w-4 h-4 mr-2" />
              Add Column
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('Sort Table')}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('Merge Cells')}
            >
              <Minimize2 className="w-4 h-4 mr-2" />
              Merge Cells
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('Reset Styles')}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Styles
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-3">
          <Button
            size="lg"
            onClick={() => handleExport('png')}
            disabled={isExporting}
            className="rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            title="Quick Export as PNG"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleQuickAction('Save Theme')}
            className="rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            title="Save Current Theme"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
