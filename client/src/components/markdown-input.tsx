import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2 } from 'lucide-react';
import { generateSampleMarkdown } from '@/lib/markdown-parser';

interface MarkdownInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownInput({ value, onChange }: MarkdownInputProps) {
  const handlePasteSample = () => {
    onChange(generateSampleMarkdown());
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Markdown Input</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePasteSample}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-4 h-4 mr-1" />
              Paste Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste your markdown table here...

Example:
| Name | Age | City |
|------|-----|------|
| John | 25 | NYC |
| Jane | 30 | LA |
| Bob | 35 | Chicago |`}
          className="min-h-64 font-mono text-sm resize-none"
        />
      </CardContent>
    </Card>
  );
}
