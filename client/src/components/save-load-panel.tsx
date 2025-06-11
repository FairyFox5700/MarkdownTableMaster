import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  FolderOpen, 
  Star, 
  Globe, 
  Lock,
  Download,
  Database
} from 'lucide-react';
import type { TableData, TableStyles } from '@/types/table-styles';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';

interface SaveLoadPanelProps {
  tableData: TableData | null;
  styles: TableStyles;
  markdownInput: string;
}

export function SaveLoadPanel({ 
  tableData, 
  styles, 
  markdownInput
}: SaveLoadPanelProps) {
  const { toast } = useToast();
  const [saveTableName, setSaveTableName] = useState('');
  const [saveThemeName, setSaveThemeName] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  // For demo purposes, using userId 1. In a real app, this would come from auth
  const userId = 1;

  const handleSaveTable = async () => {
    if (!saveTableName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table name",
        variant: "destructive",
      });
      return;
    }

    if (!tableData || !markdownInput.trim()) {
      toast({
        title: "Error",
        description: "Please create a table before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: saveTableName.trim(),
          markdownContent: markdownInput,
          styles: styles,
          isPublic,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Table saved to database!",
        });
        setSaveTableName('');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save table to database",
        variant: "destructive",
      });
    }
  };

  const handleSaveTheme = async () => {
    if (!saveThemeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a theme name",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: saveThemeName.trim(),
          styles: styles,
          isPublic,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Theme saved to database!",
        });
        setSaveThemeName('');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme to database",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-medium">Database Storage</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Save Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Save className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Save to Database</h3>
          </div>
          
          {/* Save Table */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Table Name</Label>
              <div className="flex space-x-2">
                <Input
                  value={saveTableName}
                  onChange={(e) => setSaveTableName(e.target.value)}
                  placeholder="My awesome table"
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveTable}
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Save Theme */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Theme Name</Label>
              <div className="flex space-x-2">
                <Input
                  value={saveThemeName}
                  onChange={(e) => setSaveThemeName(e.target.value)}
                  placeholder="My custom theme"
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveTheme}
                  size="sm"
                >
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="public" className="text-sm">Make public</Label>
            </div>
          </div>
          
          <div className="p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              Your tables and themes are now being saved to a PostgreSQL database. 
              This enables persistence across sessions and sharing capabilities.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}