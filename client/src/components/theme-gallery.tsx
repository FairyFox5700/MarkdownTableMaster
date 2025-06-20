import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Eye, Check, GripVertical, Search } from 'lucide-react';
import type { TableStyles } from '@/types/table-styles';
import { PRESET_THEMES } from '@/types/table-styles';
import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Input } from '@/components/ui/input';

interface ThemeGalleryProps {
  onApplyTheme: (styles: TableStyles) => void;
  currentStyles: TableStyles;
}

// Theme helper functions
const getThemeDisplayName = (key: string): string => {
  const names: Record<string, string> = {
    default: 'Default',
    minimal: 'Minimal',
    dark: 'Dark Mode',
    corporate: 'Corporate',
    ocean: 'Ocean Blue',
    forest: 'Forest Green',
    sunset: 'Sunset Orange',
    lavender: 'Lavender Purple',
    newspaper: 'Newspaper',
    soft_pink: 'Soft Pink',
    mint: 'Fresh Mint',
    steel: 'Steel Gray',
    royal: 'Royal Blue',
    cream: 'Warm Cream',
    arctic: 'Arctic White',
    crimson: 'Crimson Red',
    sage: 'Sage Green',
    midnight: 'Midnight Dark',
    gold: 'Golden Yellow',
    emerald: 'Emerald Green',
    rose: 'Rose Pink',
    amber: 'Amber Orange',
    slate: 'Slate Blue',
    monochrome: 'Monochrome',
    neon: 'Neon Green',
    pastel: 'Pastel Pink',
    nautical: 'Nautical Blue',
    desert: 'Desert Sand',
    // New themes
    cyberpunk: 'Cyberpunk',
    winter: 'Winter Frost',
    autumn: 'Autumn Leaves',
    cherry: 'Cherry Blossom',
    coffee: 'Coffee Bean',
    vintage: 'Vintage Paper',
    tech: 'Tech Noir',
    candy: 'Candy Pop',
    retro: 'Retro Console',
    elegant: 'Elegant Serif',
  };
  return names[key] || key;
};

const getThemeCategory = (key: string): string => {
  if (['dark', 'midnight', 'tech', 'cyberpunk'].includes(key)) return 'Dark';
  if (['corporate', 'newspaper', 'arctic', 'steel', 'monochrome', 'elegant'].includes(key)) return 'Professional';
  if (['ocean', 'forest', 'mint', 'emerald', 'sage', 'nautical', 'winter'].includes(key)) return 'Nature';
  if (['sunset', 'gold', 'amber', 'crimson', 'desert', 'autumn', 'coffee', 'vintage'].includes(key)) return 'Warm';
  if (['lavender', 'royal', 'soft_pink', 'rose', 'pastel', 'neon', 'cherry', 'candy', 'retro'].includes(key)) return 'Vibrant';
  return 'Classic';
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Dark': return 'bg-gray-100 text-gray-800';
    case 'Professional': return 'bg-blue-100 text-blue-800';
    case 'Nature': return 'bg-green-100 text-green-800';
    case 'Warm': return 'bg-orange-100 text-orange-800';
    case 'Vibrant': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Define item type for drag and drop
const ItemTypes = {
  THEME: 'theme',
};

interface DraggableThemeProps {
  theme: TableStyles;
  name: string;
  index: number;
  id: string;
  moveTheme: (dragIndex: number, hoverIndex: number) => void;
  onApplyTheme: (theme: TableStyles) => void;
  isCurrent: boolean;
}

// Draggable theme component
const DraggableTheme = ({ theme, name, index, id, moveTheme, onApplyTheme, isCurrent }: DraggableThemeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const category = getThemeCategory(id);
  
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.THEME,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveTheme(dragIndex, hoverIndex);
      
      // Note: mutating the monitor item here
      item.index = hoverIndex;
    },
  });
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.THEME,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));
  
  // Theme Preview Component
  const ThemePreview = () => (
    <div className="relative">
      <div 
        className="w-full h-20 rounded-lg border overflow-hidden"
        style={{ 
          backgroundColor: theme.backgroundColor,
          borderRadius: theme.roundedCorners ? '0.5rem' : '0'
        }}
      >
        {/* Header preview */}
        <div 
          className="h-6 border-b flex items-center px-2"
          style={{ 
            backgroundColor: theme.headerColor,
            borderColor: theme.borderColor,
            borderWidth: theme.borderStyle === 'none' ? 0 : theme.borderWidth,
            borderStyle: theme.borderStyle
          }}
        >
          <div 
            className="text-xs font-medium truncate"
            style={{ 
              color: theme.textColor,
              fontFamily: theme.fontFamily,
              fontSize: Math.max(8, theme.fontSize - 4)
            }}
          >
            Header
          </div>
        </div>
        
        {/* Rows preview */}
        <div className="space-y-0">
          {[0, 1].map((rowIndex) => (
            <div 
              key={rowIndex}
              className="h-7 flex items-center px-2"
              style={{ 
                backgroundColor: theme.stripedRows && rowIndex % 2 === 1 
                  ? theme.headerColor 
                  : theme.backgroundColor,
                borderBottomColor: theme.borderColor,
                borderBottomWidth: theme.borderStyle === 'none' ? 0 : 1,
                borderBottomStyle: theme.borderStyle
              }}
            >
              <div 
                className="text-xs truncate"
                style={{ 
                  color: theme.textColor,
                  fontFamily: theme.fontFamily,
                  fontSize: Math.max(8, theme.fontSize - 4)
                }}
              >
                Sample data
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isCurrent && (
        <div className="absolute top-1 right-1">
          <div className="bg-green-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
        isCurrent ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
      onClick={() => onApplyTheme(theme)}
      data-handler-id={handlerId}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-1 items-center">
          <div className="mr-2 cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm">{name}</h3>
              <Badge className={`text-xs ${getCategoryColor(category)}`}>
                {category}
              </Badge>
              {isCurrent && (
                <Badge variant="default" className="text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {theme.fontFamily} • {theme.fontSize}px • {theme.stripedRows ? 'Striped' : 'Solid'}
            </p>
          </div>
        </div>
      </div>
      
      <ThemePreview />
      
      <div className="mt-3 flex justify-between items-center">
        <div className="flex space-x-1">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: theme.backgroundColor }}
            title="Background"
          />
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: theme.headerColor }}
            title="Header"
          />
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: theme.borderColor }}
            title="Border"
          />
        </div>
        
        <Button 
          size="sm" 
          variant={isCurrent ? "default" : "outline"}
          onClick={(e) => {
            e.stopPropagation();
            onApplyTheme(theme);
          }}
        >
          {isCurrent ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Applied
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Apply
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export function ThemeGallery({ onApplyTheme, currentStyles }: ThemeGalleryProps) {
  // Initialize state with theme entries
  const [themes, setThemes] = useState<[string, TableStyles][]>(() => 
    Object.entries(PRESET_THEMES) as [string, TableStyles][]
  );
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Function to handle theme reordering
  const moveTheme = (dragIndex: number, hoverIndex: number) => {
    const newThemes = [...themes];
    const draggedTheme = newThemes[dragIndex];
    
    // Remove from old position and insert at new position
    newThemes.splice(dragIndex, 1);
    newThemes.splice(hoverIndex, 0, draggedTheme);
    
    setThemes(newThemes);
  };

  // Function to filter themes by category
  const handleFilterChange = (category: string | null) => {
    setFilter(category);
  };

  // Local storage key for theme order
  const THEME_ORDER_KEY = 'markdown-table-master:theme-order';

  // Load theme order from local storage on component mount
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(THEME_ORDER_KEY);
      if (savedOrder) {
        const orderKeys: string[] = JSON.parse(savedOrder);
        // Reorder themes based on saved order
        const allThemeEntries = Object.entries(PRESET_THEMES) as [string, TableStyles][];
        const orderedThemes: [string, TableStyles][] = [];
        
        // First add themes that are in the saved order
        orderKeys.forEach(key => {
          const themeEntry = allThemeEntries.find(([k]) => k === key);
          if (themeEntry) {
            orderedThemes.push(themeEntry);
          }
        });
        
        // Then add any new themes that weren't in the saved order
        allThemeEntries.forEach(themeEntry => {
          const [key] = themeEntry;
          if (!orderKeys.includes(key)) {
            orderedThemes.push(themeEntry);
          }
        });
        
        setThemes(orderedThemes);
      }
    } catch (error) {
      console.error("Failed to load theme order from localStorage:", error);
    }
  }, []);

  // Save theme order to local storage when themes change
  useEffect(() => {
    try {
      const themeKeys = themes.map(([key]) => key);
      localStorage.setItem(THEME_ORDER_KEY, JSON.stringify(themeKeys));
    } catch (error) {
      console.error("Failed to save theme order to localStorage:", error);
    }
  }, [themes]);

  // Get filtered themes based on category filter and search term
  const filteredThemes = themes.filter(([key]) => {
    const matchesCategory = !filter || getThemeCategory(key) === filter;
    const displayName = getThemeDisplayName(key).toLowerCase();
    const matchesSearch = !searchTerm || displayName.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isCurrentTheme = (theme: TableStyles): boolean => {
    return JSON.stringify(theme) === JSON.stringify(currentStyles);
  };

  // Get all available categories
  const allCategories = Array.from(new Set(
    themes.map(([key]) => getThemeCategory(key))
  )).sort();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-medium">Theme Gallery</CardTitle>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2 text-muted-foreground">Sort:</span>
            <span className="text-xs text-primary">Drag to reorder themes</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search themes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Category filter buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant={filter === null ? "default" : "outline"}
            onClick={() => handleFilterChange(null)}
          >
            All
          </Button>
          {allCategories.map(category => (
            <Button
              key={category}
              size="sm"
              variant={filter === category ? "default" : "outline"}
              onClick={() => handleFilterChange(category)}
              className={`${filter === category ? '' : getCategoryColor(category)}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-96">
          <div className="grid grid-cols-1 gap-4">
            {filteredThemes.map(([key, theme], index) => {
              const displayName = getThemeDisplayName(key);
              const isCurrent = isCurrentTheme(theme);
              
              return (
                <DraggableTheme
                  key={key}
                  id={key}
                  index={index}
                  name={displayName}
                  theme={theme}
                  moveTheme={moveTheme}
                  onApplyTheme={onApplyTheme}
                  isCurrent={isCurrent}
                />
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-4 text-sm text-center text-muted-foreground">
          {themes.length} themes available • {filteredThemes.length} showing
          {filter ? ` in ${filter} category` : ''}
          {searchTerm ? ` matching "${searchTerm}"` : ''}
        </div>
      </CardContent>
    </Card>
  );
}