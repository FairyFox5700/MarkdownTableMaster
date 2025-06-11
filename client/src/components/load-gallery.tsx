import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  FolderOpen, 
  Globe, 
  Lock,
  Download,
  Star,
  RefreshCw
} from 'lucide-react';
import type { TableData, TableStyles } from '@/types/table-styles';
import { useState } from 'react';

interface LoadGalleryProps {
  onLoadTable: (markdown: string, styles: TableStyles) => void;
  onLoadTheme: (styles: TableStyles) => void;
}

export function LoadGallery({ onLoadTable, onLoadTheme }: LoadGalleryProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'tables' | 'themes'>('tables');

  // Fetch saved tables
  const { data: savedTables = [], isLoading: loadingTables, refetch: refetchTables } = useQuery({
    queryKey: ['/api/tables', 'public'],
    queryFn: async () => {
      const response = await fetch('/api/tables?public=true');
      if (!response.ok) throw new Error('Failed to fetch tables');
      return response.json();
    },
  });

  // Fetch custom themes
  const { data: customThemes = [], isLoading: loadingThemes, refetch: refetchThemes } = useQuery({
    queryKey: ['/api/themes', 'public'],
    queryFn: async () => {
      const response = await fetch('/api/themes?public=true');
      if (!response.ok) throw new Error('Failed to fetch themes');
      return response.json();
    },
  });

  const handleLoadTable = (table: any) => {
    onLoadTable(table.markdownContent, table.styles as TableStyles);
    toast({
      title: "Success",
      description: `Loaded table: ${table.name}`,
    });
  };

  const handleLoadTheme = (theme: any) => {
    onLoadTheme(theme.styles as TableStyles);
    toast({
      title: "Success",
      description: `Applied theme: ${theme.name}`,
    });
  };

  const handleRefresh = () => {
    if (activeTab === 'tables') {
      refetchTables();
    } else {
      refetchThemes();
    }
    toast({
      title: "Refreshed",
      description: "Gallery updated with latest content",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-medium">Load Gallery</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'tables' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('tables')}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Tables ({savedTables.length})
          </Button>
          <Button
            variant={activeTab === 'themes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('themes')}
            className="flex-1"
          >
            <Star className="w-4 h-4 mr-2" />
            Themes ({customThemes.length})
          </Button>
        </div>

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div className="space-y-3">
            {loadingTables ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Loading tables...
              </div>
            ) : savedTables.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedTables.map((table: any) => (
                  <div key={table.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium truncate">{table.name}</span>
                        {table.isPublic ? (
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(table.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleLoadTable(table)}
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No saved tables found
              </div>
            )}
          </div>
        )}

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div className="space-y-3">
            {loadingThemes ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Loading themes...
              </div>
            ) : customThemes.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {customThemes.map((theme: any) => (
                  <div key={theme.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium truncate">{theme.name}</span>
                        {theme.isPublic ? (
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(theme.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleLoadTheme(theme)}
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No custom themes found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}