import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Palette, Type, Settings, Cog } from 'lucide-react';
import type { TableStyles } from '@/types/table-styles';
import { PRESET_THEMES } from '@/types/table-styles';

interface StyleControlsProps {
  styles: TableStyles;
  onStyleChange: (styles: TableStyles) => void;
}

export function StyleControls({ styles, onStyleChange }: StyleControlsProps) {
  const updateStyle = (key: keyof TableStyles, value: any) => {
    onStyleChange({ ...styles, [key]: value });
  };

  const applyTheme = (themeName: string) => {
    if (themeName in PRESET_THEMES) {
      onStyleChange(PRESET_THEMES[themeName as keyof typeof PRESET_THEMES]);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Style Controls</CardTitle>
          <Select onValueChange={applyTheme} defaultValue="default">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Theme</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="fancy">Fancy</SelectItem>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Typography Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Typography</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Font Family</Label>
              <Select value={styles.fontFamily} onValueChange={(value) => updateStyle('fontFamily', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Font Size</Label>
              <Slider
                value={[styles.fontSize]}
                onValueChange={([value]) => updateStyle('fontSize', value)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>12px</span>
                <span>{styles.fontSize}px</span>
                <span>24px</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Colors Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Colors</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Text Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={styles.textColor}
                  onChange={(e) => updateStyle('textColor', e.target.value)}
                  className="w-8 h-8 p-0 border cursor-pointer"
                />
                <Input
                  type="text"
                  value={styles.textColor}
                  onChange={(e) => updateStyle('textColor', e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Background</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={styles.backgroundColor}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="w-8 h-8 p-0 border cursor-pointer"
                />
                <Input
                  type="text"
                  value={styles.backgroundColor}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Header Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={styles.headerColor}
                  onChange={(e) => updateStyle('headerColor', e.target.value)}
                  className="w-8 h-8 p-0 border cursor-pointer"
                />
                <Input
                  type="text"
                  value={styles.headerColor}
                  onChange={(e) => updateStyle('headerColor', e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Border Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={styles.borderColor}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="w-8 h-8 p-0 border cursor-pointer"
                />
                <Input
                  type="text"
                  value={styles.borderColor}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Layout Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Layout & Borders</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Border Style</Label>
              <Select value={styles.borderStyle} onValueChange={(value: any) => updateStyle('borderStyle', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Border Width</Label>
              <Slider
                value={[styles.borderWidth]}
                onValueChange={([value]) => updateStyle('borderWidth', value)}
                min={0}
                max={4}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0px</span>
                <span>{styles.borderWidth}px</span>
                <span>4px</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Cell Padding</Label>
              <Slider
                value={[styles.cellPadding]}
                onValueChange={([value]) => updateStyle('cellPadding', value)}
                min={4}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4px</span>
                <span>{styles.cellPadding}px</span>
                <span>20px</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Text Alignment</Label>
              <Select value={styles.textAlignment} onValueChange={(value: any) => updateStyle('textAlignment', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Advanced Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Cog className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Advanced Options</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="striped-rows"
                checked={styles.stripedRows}
                onCheckedChange={(checked) => updateStyle('stripedRows', checked)}
              />
              <Label htmlFor="striped-rows" className="text-sm">Striped rows</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hover-effects"
                checked={styles.hoverEffects}
                onCheckedChange={(checked) => updateStyle('hoverEffects', checked)}
              />
              <Label htmlFor="hover-effects" className="text-sm">Hover effects</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="header-styling"
                checked={styles.headerStyling}
                onCheckedChange={(checked) => updateStyle('headerStyling', checked)}
              />
              <Label htmlFor="header-styling" className="text-sm">Header styling</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rounded-corners"
                checked={styles.roundedCorners}
                onCheckedChange={(checked) => updateStyle('roundedCorners', checked)}
              />
              <Label htmlFor="rounded-corners" className="text-sm">Rounded corners</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
