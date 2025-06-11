import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  RefreshCw,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Palette
} from 'lucide-react';
import type { TableData, TableStyles } from '@/types/table-styles';

interface StyleSuggestion {
  name: string;
  description: string;
  reasoning: string;
  styles: Partial<TableStyles>;
  category: 'professional' | 'casual' | 'technical' | 'creative';
}

interface TableAnalysis {
  dataTypes: string[];
  purpose: string;
  recommendations: string[];
}

interface AISuggestionsProps {
  tableData: TableData | null;
  markdownInput: string;
  onApplyStyles: (styles: TableStyles) => void;
  currentStyles: TableStyles;
}

export function AISuggestions({ 
  tableData, 
  markdownInput, 
  onApplyStyles, 
  currentStyles 
}: AISuggestionsProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<StyleSuggestion[]>([]);
  const [analysis, setAnalysis] = useState<TableAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const generateSuggestions = async () => {
    if (!tableData || !markdownInput.trim()) {
      toast({
        title: "No Table Data",
        description: "Please create a table first to get AI suggestions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/style-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableData,
          markdownContent: markdownInput,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setUsingFallback(false);
      
      toast({
        title: "AI Suggestions Ready",
        description: `Generated ${data.suggestions?.length || 0} styling suggestions`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTable = async () => {
    if (!tableData) {
      toast({
        title: "No Table Data",
        description: "Please create a table first to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableData }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze table');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze table content",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: StyleSuggestion) => {
    const mergedStyles = { ...currentStyles, ...suggestion.styles };
    onApplyStyles(mergedStyles as TableStyles);
    
    toast({
      title: "Style Applied",
      description: `Applied "${suggestion.name}" styling`,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'professional': return <TrendingUp className="w-3 h-3" />;
      case 'casual': return <Palette className="w-3 h-3" />;
      case 'technical': return <CheckCircle className="w-3 h-3" />;
      case 'creative': return <Sparkles className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'casual': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'creative': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-medium">AI Suggestions</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeTable}
              disabled={isAnalyzing || !tableData}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4 mr-2" />
              )}
              Analyze
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={generateSuggestions}
              disabled={isLoading || !tableData}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Get Suggestions
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Table Analysis */}
        {analysis && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Table Analysis</h3>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div>
                <span className="text-xs font-medium text-muted-foreground">Purpose:</span>
                <p className="text-sm">{analysis.purpose}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Data Types:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.dataTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              {analysis.recommendations.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Recommendations:</span>
                  <ul className="text-sm space-y-1 mt-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Style Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Style Suggestions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium">{suggestion.name}</h4>
                        <Badge 
                          className={`text-xs ${getCategoryColor(suggestion.category)}`}
                        >
                          {getCategoryIcon(suggestion.category)}
                          <span className="ml-1 capitalize">{suggestion.category}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {suggestion.description}
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        {suggestion.reasoning}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applySuggestion(suggestion)}
                      className="ml-3"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Click "Get Suggestions" to let AI analyze your table and recommend optimal styling</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}