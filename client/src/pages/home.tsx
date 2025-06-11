import { useState, useEffect } from 'react';
import { Table, HelpCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownInput } from '@/components/markdown-input';
import { StyleControls } from '@/components/style-controls';
import { TablePreview } from '@/components/table-preview';
import { ExportPanel } from '@/components/export-panel';
import { SaveLoadPanel } from '@/components/save-load-panel';
import { LoadGallery } from '@/components/load-gallery';
import { AISuggestions } from '@/components/ai-suggestions';
import { parseMarkdownTable, generateSampleMarkdown } from '@/lib/markdown-parser';
import { DEFAULT_STYLES } from '@/types/table-styles';
import type { TableStyles, TableData } from '@/types/table-styles';

export default function Home() {
  const [markdownInput, setMarkdownInput] = useState('');
  const [tableStyles, setTableStyles] = useState<TableStyles>(DEFAULT_STYLES);
  const [tableData, setTableData] = useState<TableData | null>(null);

  // Parse markdown whenever input changes
  useEffect(() => {
    if (markdownInput.trim()) {
      const parsed = parseMarkdownTable(markdownInput);
      setTableData(parsed);
    } else {
      setTableData(null);
    }
  }, [markdownInput]);

  // Load sample data on initial render
  useEffect(() => {
    setMarkdownInput(generateSampleMarkdown());
  }, []);

  const handleLoadTable = (markdown: string, styles: TableStyles) => {
    setMarkdownInput(markdown);
    setTableStyles(styles);
  };

  const handleLoadTheme = (styles: TableStyles) => {
    setTableStyles(styles);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Table className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold text-gray-900">Table Beautifier</h1>
              </div>
              <span className="text-sm text-gray-500 hidden sm:inline">
                Transform your markdown tables into beautiful exports
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Input and Controls */}
          <div className="lg:col-span-5 space-y-6">
            <MarkdownInput 
              value={markdownInput}
              onChange={setMarkdownInput}
            />
            <StyleControls 
              styles={tableStyles}
              onStyleChange={setTableStyles}
            />
            <SaveLoadPanel 
              tableData={tableData}
              styles={tableStyles}
              markdownInput={markdownInput}
            />
            <LoadGallery 
              onLoadTable={handleLoadTable}
              onLoadTheme={handleLoadTheme}
            />
          </div>

          {/* Right Panel - Preview and Export */}
          <div className="lg:col-span-7 space-y-6">
            <AISuggestions 
              tableData={tableData}
              markdownInput={markdownInput}
              onApplyStyles={setTableStyles}
              currentStyles={tableStyles}
            />
            <TablePreview 
              tableData={tableData}
              styles={tableStyles}
            />
            <ExportPanel tableData={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
}
