import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Code, GripVertical, GripHorizontal } from 'lucide-react';
import type { TableData, TableStyles } from '@/types/table-styles';
import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// Define the item types for drag and drop
const ItemTypes = {
  ROW: 'row',
  COLUMN: 'column'
};

interface TablePreviewProps {
  tableData: TableData | null;
  styles: TableStyles;
  onMoveRow?: (dragIndex: number, hoverIndex: number) => void;
  onMoveColumn?: (dragIndex: number, hoverIndex: number) => void;
}

export function TablePreview({ tableData, styles, onMoveRow, onMoveColumn }: TablePreviewProps) {
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
    borderCollapse: 'separate', // Changed from collapse to separate to enable border-radius
    borderSpacing: 0, // No space between cells
    width: '100%',
    ...(styles.roundedCorners && { 
      borderRadius: '8px',
      overflow: 'hidden'
    }),
  });

  const getCellStyles = (
    isHeader: boolean = false, 
    isFirstRow: boolean = false,
    isLastRow: boolean = false,
    isFirstCell: boolean = false,
    isLastCell: boolean = false
  ): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      padding: `${styles.cellPadding}px`,
      textAlign: styles.textAlignment as "left" | "center" | "right",
      borderColor: styles.borderColor,
      borderStyle: styles.borderStyle,
      borderWidth: styles.borderStyle === 'none' ? 0 : `${styles.borderWidth}px`,
      backgroundColor: isHeader && styles.headerStyling ? styles.headerColor : 'inherit',
      fontWeight: isHeader && styles.headerStyling ? 600 : 'normal',
      textTransform: isHeader && styles.headerStyling ? 'uppercase' : 'none',
      fontSize: isHeader && styles.headerStyling ? '0.75rem' : 'inherit',
      letterSpacing: isHeader && styles.headerStyling ? '0.05em' : 'normal',
    };

    // Add rounded corners to the appropriate cells when roundedCorners is enabled
    if (styles.roundedCorners) {
      if (isFirstRow && isFirstCell) {
        baseStyles.borderTopLeftRadius = '8px';
      }
      if (isFirstRow && isLastCell) {
        baseStyles.borderTopRightRadius = '8px';
      }
      if (isLastRow && isFirstCell) {
        baseStyles.borderBottomLeftRadius = '8px';
      }
      if (isLastRow && isLastCell) {
        baseStyles.borderBottomRightRadius = '8px';
      }
    }

    return baseStyles;
  };

  const getRowStyles = (index: number, isLastRow: boolean = false): React.CSSProperties => ({
    backgroundColor: styles.stripedRows && index % 2 === 1 ? 
      `${styles.backgroundColor}dd` : 'inherit',
    ...(styles.hoverEffects && {
      transition: 'background-color 0.15s ease-in-out',
    }),
  });

  const generateHTML = () => {
    const tableStyles = getTableStyles();
    
    // Helper to convert style object to CSS string
    const styleObjToCssString = (obj: Record<string, any>) => 
      Object.entries(obj)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
    
    return `<table style="${styleObjToCssString(tableStyles)}">
  <thead>
    <tr>
      <th style="width: 30px; padding: 0 5px;"></th>
      ${tableData.headers.map((header, index) => {
        const headerStyles = getCellStyles(
          true,
          true,
          tableData.rows.length === 0,
          index === 0,
          index === tableData.headers.length - 1
        );
        return `<th style="${styleObjToCssString(headerStyles)}">
        ${onMoveColumn ? `<div style="display: flex; align-items: center; gap: 8px;">
          <div style="cursor: grab;">≡≡</div>
          ${header}
        </div>` : header}
      </th>`;
      }).join('\n      ')}
    </tr>
  </thead>
  <tbody>
    ${tableData.rows.map((row, rowIndex) => {
      const isLastRow = rowIndex === tableData.rows.length - 1;
      const rowStyle = styles.stripedRows ? 
        `background-color: ${rowIndex % 2 === 1 ? styles.backgroundColor + 'dd' : 'inherit'}` : '';
      
      return `<tr${rowStyle ? ` style="${rowStyle}"` : ''}>
      <td style="width: 30px; padding: 0 5px; text-align: center;">${onMoveRow ? '⋮⋮' : ''}</td>
      ${row.map((cell, cellIndex) => {
        const cellStyles = getCellStyles(
          false,
          false,
          isLastRow,
          cellIndex === 0,
          cellIndex === row.length - 1
        );
        return `<td style="${styleObjToCssString(cellStyles)}">${cell}</td>`;
      }).join('\n      ')}
    </tr>`;
    }).join('\n    ')}
  </tbody>
</table>${styles.hoverEffects ? '\n\n<style>\n  table tbody tr:hover { background-color: ' + 
styles.backgroundColor + 'bb !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }\n  table tbody tr { transition: background-color 0.2s ease, box-shadow 0.2s ease; }\n</style>' : ''}`;
  };

  // DraggableRow Component
  interface DraggableRowProps {
    index: number;
    cells: string[];
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    isLastRow: boolean;
    rowStyles: React.CSSProperties;
    getCellStyles: (
      isHeader: boolean,
      isFirstRow: boolean,
      isLastRow: boolean,
      isFirstCell: boolean, 
      isLastCell: boolean
    ) => React.CSSProperties;
  }

  const DraggableRow: React.FC<DraggableRowProps> = ({ 
    index, 
    cells, 
    moveRow, 
    isLastRow, 
    rowStyles,
    getCellStyles 
  }) => {
    const ref = useRef<HTMLTableRowElement>(null);
    
    const [, drop] = useDrop({
      accept: ItemTypes.ROW,
      hover(item: { index: number, type: string }, monitor) {
        if (!ref.current || item.type !== ItemTypes.ROW) return;
        
        const dragIndex = item.index;
        const hoverIndex = index;
        
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) return;
        
        // Get rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        
        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        
        // Get mouse position
        const clientOffset = monitor.getClientOffset();
        
        // Get pixels to the top
        const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
        
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        
        // Time to actually perform the action
        moveRow(dragIndex, hoverIndex);
        
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      },
    });
    
    const [{ isDragging }, drag, preview] = useDrag({
      type: ItemTypes.ROW,
      item: { index, type: ItemTypes.ROW },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    
    drop(preview(ref));
    
    return (
      <tr 
        ref={ref} 
        style={{
          ...rowStyles,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
        className={isDragging ? 'dragging-row' : ''}
      >
        <td style={{
          width: '30px',
          padding: '0 5px',
          textAlign: 'center',
          cursor: 'grab'
        }}>
          <div ref={drag} style={{ display: 'inline-block', cursor: 'grab' }} data-drag-handle>
            <GripVertical size={16} />
          </div>
        </td>
        {cells.map((cell, cellIndex) => (
          <td 
            key={cellIndex} 
            style={getCellStyles(
              false,
              false, 
              isLastRow, 
              cellIndex === 0, 
              cellIndex === cells.length - 1
            )}
          >
            {cell}
          </td>
        ))}
      </tr>
    );
  };

  // DraggableHeaderCell Component
  interface DraggableHeaderCellProps {
    index: number;
    content: string;
    moveColumn: (dragIndex: number, hoverIndex: number) => void;
    cellStyles: React.CSSProperties;
  }

  const DraggableHeaderCell: React.FC<DraggableHeaderCellProps> = ({ 
    index, 
    content, 
    moveColumn, 
    cellStyles 
  }) => {
    const ref = useRef<HTMLTableCellElement>(null);
    
    const [, drop] = useDrop({
      accept: ItemTypes.COLUMN,
      hover(item: { index: number, type: string }, monitor) {
        if (!ref.current || item.type !== ItemTypes.COLUMN) return;
        
        const dragIndex = item.index;
        const hoverIndex = index;
        
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) return;
        
        // Get rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        
        // Get horizontal middle
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        
        // Get mouse position
        const clientOffset = monitor.getClientOffset();
        
        // Get pixels to the top
        const hoverClientX = clientOffset!.x - hoverBoundingRect.left;
        
        // Only perform the move when the mouse has crossed half of the items width
        // When dragging rightward, only move when the cursor is after 50%
        // When dragging leftward, only move when the cursor is before 50%
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
        
        // Time to actually perform the action
        moveColumn(dragIndex, hoverIndex);
        
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      },
    });
    
    const [{ isDragging }, drag, preview] = useDrag({
      type: ItemTypes.COLUMN,
      item: { index, type: ItemTypes.COLUMN },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    
    drop(preview(ref));
    
    return (
      <th 
        ref={ref} 
        style={{
          ...cellStyles,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
        className={isDragging ? 'dragging-column' : ''}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div ref={drag} style={{ cursor: 'grab' }} data-drag-handle>
            <GripHorizontal size={16} />
          </div>
          {content}
        </div>
      </th>
    );
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
                  {/* Empty cell for row handle column */}
                  <th style={{ width: '30px', padding: '0 5px' }}></th>
                  {tableData.headers.map((header, index) => (
                    onMoveColumn ? (
                      <DraggableHeaderCell
                        key={index}
                        index={index}
                        content={header}
                        moveColumn={onMoveColumn}
                        cellStyles={getCellStyles(
                          /* isHeader */ true,
                          /* isFirstRow */ true, 
                          /* isLastRow */ tableData.rows.length === 0, 
                          /* isFirstCell */ index === 0, 
                          /* isLastCell */ index === tableData.headers.length - 1
                        )}
                      />
                    ) : (
                      <th 
                        key={index} 
                        style={getCellStyles(
                          /* isHeader */ true,
                          /* isFirstRow */ true, 
                          /* isLastRow */ tableData.rows.length === 0, 
                          /* isFirstCell */ index === 0, 
                          /* isLastCell */ index === tableData.headers.length - 1
                        )}
                      >
                        {header}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  onMoveRow ? (
                    <DraggableRow
                      key={rowIndex}
                      index={rowIndex}
                      cells={row}
                      moveRow={onMoveRow}
                      isLastRow={rowIndex === tableData.rows.length - 1}
                      rowStyles={getRowStyles(rowIndex, rowIndex === tableData.rows.length - 1)}
                      getCellStyles={getCellStyles}
                    />
                  ) : (
                    <tr 
                      key={rowIndex} 
                      style={getRowStyles(rowIndex, rowIndex === tableData.rows.length - 1)}
                    >
                      <td style={{ width: '30px', padding: '0 5px' }}></td>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex} 
                          style={getCellStyles(
                            /* isHeader */ false,
                            /* isFirstRow */ false, 
                            /* isLastRow */ rowIndex === tableData.rows.length - 1, 
                            /* isFirstCell */ cellIndex === 0, 
                            /* isLastCell */ cellIndex === row.length - 1
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
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

      {styles.hoverEffects && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .hover-enabled tbody tr:hover {
              background-color: ${styles.backgroundColor}bb !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              transform: translateY(-1px);
            }
            .hover-enabled tbody tr {
              transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            /* Drag handle styles */
            th [data-drag-handle], td [data-drag-handle] {
              opacity: 0.6;
              transition: opacity 0.2s ease;
            }
            
            tr:hover [data-drag-handle], th:hover [data-drag-handle] {
              opacity: 1;
            }
            
            /* Dragging styles */
            .dragging-row {
              opacity: 0.6;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
            
            .dragging-column {
              opacity: 0.6;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
          `
        }} />
      )}
    </Card>
  );
}
