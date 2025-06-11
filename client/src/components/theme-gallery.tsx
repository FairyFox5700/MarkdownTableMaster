import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Eye, Check } from 'lucide-react';
import type { TableStyles } from '@/types/table-styles';
import { PRESET_THEMES } from '@/types/table-styles';

interface ThemeGalleryProps {
  onApplyTheme: (styles: TableStyles) => void;
  currentStyles: TableStyles;
}

export function ThemeGallery({ onApplyTheme, currentStyles }: ThemeGalleryProps) {
  const themeEntries = Object.entries(PRESET_THEMES);

  const getThemeDisplayName = (key: string): string => {
    const names: Record<string, string> = {
      default: 'Default',
      minimal: 'Minimal',
      fancy: 'Fancy',
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
    };
    return names[key] || key;
  };

  const getThemeCategory = (key: string): string => {
    if (['dark', 'midnight'].includes(key)) return 'Dark';
    if (['corporate', 'newspaper', 'arctic', 'steel'].includes(key)) return 'Professional';
    if (['ocean', 'forest', 'mint', 'emerald', 'sage'].includes(key)) return 'Nature';
    if (['sunset', 'gold', 'amber', 'crimson'].includes(key)) return 'Warm';
    if (['lavender', 'royal', 'soft_pink', 'rose'].includes(key)) return 'Vibrant';
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

  const isCurrentTheme = (theme: TableStyles): boolean => {
    return JSON.stringify(theme) === JSON.stringify(currentStyles);
  };

  const ThemePreview = ({ theme, name }: { theme: TableStyles; name: string }) => (
    <div className="relative">
      <div 
        className="w-full h-20 rounded-lg border overflow-hidden"
        style={{ backgroundColor: theme.backgroundColor }}
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
              fontSize: Math.max(8, theme.fontSize - 4)
            }}
          >
            Header
          </div>
        </div>
        
        {/* Rows preview */}
        <div className="space-y-0">
          {[0, 1].map((index) => (
            <div 
              key={index}
              className="h-7 flex items-center px-2"
              style={{ 
                backgroundColor: theme.stripedRows && index % 2 === 1 
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
                  fontSize: Math.max(8, theme.fontSize - 4)
                }}
              >
                Sample data
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isCurrentTheme(theme) && (
        <div className="absolute top-1 right-1">
          <div className="bg-green-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-medium">Theme Gallery</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="grid grid-cols-1 gap-4">
            {themeEntries.map(([key, theme]) => {
              const displayName = getThemeDisplayName(key);
              const category = getThemeCategory(key);
              const isCurrent = isCurrentTheme(theme);
              
              return (
                <div 
                  key={key} 
                  className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                    isCurrent ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onApplyTheme(theme)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-sm">{displayName}</h3>
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
                  
                  <ThemePreview theme={theme} name={displayName} />
                  
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
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}