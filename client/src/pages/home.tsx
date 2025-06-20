import { useState, useEffect, useCallback } from 'react';
import { Table, HelpCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownInput } from '@/components/markdown-input';
import { StyleControls } from '@/components/style-controls';
import { TablePreview } from '@/components/table-preview';
import { ExportPanel } from '@/components/export-panel';
import { DemoDialog } from '@/components/demo-dialog';
import { parseMarkdownTable, generateSampleMarkdown } from '@/lib/markdown-parser';
import { DEFAULT_STYLES } from '@/types/table-styles';
import type { TableStyles, TableData } from '@/types/table-styles';

export default function Home() {
  const [markdownInput, setMarkdownInput] = useState('');
  const [tableStyles, setTableStyles] = useState<TableStyles>(DEFAULT_STYLES);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

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

  // Function to move a row from one index to another
  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!tableData) return;
    
    const newRows = [...tableData.rows];
    const draggedRow = newRows[dragIndex];
    
    // Remove the row from the old position
    newRows.splice(dragIndex, 1);
    // Insert the row at the new position
    newRows.splice(hoverIndex, 0, draggedRow);
    
    // Update the table data
    setTableData({
      ...tableData,
      rows: newRows
    });
    
    // Update the markdown input to reflect the change
    updateMarkdownFromTableData({
      ...tableData,
      rows: newRows
    });
  }, [tableData]);

  // Function to move a column from one index to another
  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!tableData) return;
    
    // Create new headers by moving the dragged header
    const newHeaders = [...tableData.headers];
    const draggedHeader = newHeaders[dragIndex];
    newHeaders.splice(dragIndex, 1);
    newHeaders.splice(hoverIndex, 0, draggedHeader);
    
    // Create new rows with columns reordered
    const newRows = tableData.rows.map(row => {
      const newRow = [...row];
      const draggedCell = newRow[dragIndex];
      newRow.splice(dragIndex, 1);
      newRow.splice(hoverIndex, 0, draggedCell);
      return newRow;
    });
    
    // Update the table data
    setTableData({
      headers: newHeaders,
      rows: newRows
    });
    
    // Update the markdown input to reflect the change
    updateMarkdownFromTableData({
      headers: newHeaders,
      rows: newRows
    });
  }, [tableData]);

  // Function to update markdown input based on table data
  const updateMarkdownFromTableData = (data: TableData) => {
    const headerLine = `| ${data.headers.join(' | ')} |`;
    const separatorLine = `| ${data.headers.map(() => '------').join(' | ')} |`;
    const rowLines = data.rows.map(row => `| ${row.join(' | ')} |`);
    
    const newMarkdown = [headerLine, separatorLine, ...rowLines].join('\n');
    setMarkdownInput(newMarkdown);
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsDemoOpen(true)}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">How to Use</span>
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
          </div>

          {/* Right Panel - Preview and Export */}
          <div className="lg:col-span-7 space-y-6">
            <TablePreview 
              tableData={tableData}
              styles={tableStyles}
              onMoveRow={moveRow}
              onMoveColumn={moveColumn}
            />
            <ExportPanel tableData={tableData} />
          </div>
        </div>
      </div>
      
      {/* Demo Dialog */}
      <DemoDialog 
        open={isDemoOpen} 
        onOpenChange={setIsDemoOpen} 
      />
    </div>
  );
}
