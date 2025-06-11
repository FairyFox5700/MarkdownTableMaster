export interface TableStyles {
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  borderWidth: number;
  cellPadding: number;
  textAlignment: 'left' | 'center' | 'right';
  stripedRows: boolean;
  hoverEffects: boolean;
  headerStyling: boolean;
  roundedCorners: boolean;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ExportSettings {
  quality: 'high' | 'medium' | 'low';
  background: 'transparent' | 'white' | 'custom';
  customBackground?: string;
}

export const DEFAULT_STYLES: TableStyles = {
  fontFamily: 'Inter',
  fontSize: 14,
  textColor: '#1F2937',
  backgroundColor: '#FFFFFF',
  headerColor: '#F9FAFB',
  borderColor: '#E5E7EB',
  borderStyle: 'solid',
  borderWidth: 1,
  cellPadding: 12,
  textAlignment: 'left',
  stripedRows: true,
  hoverEffects: false,
  headerStyling: true,
  roundedCorners: false,
};

export const PRESET_THEMES = {
  default: DEFAULT_STYLES,
  minimal: {
    ...DEFAULT_STYLES,
    borderStyle: 'none' as const,
    stripedRows: false,
    headerStyling: false,
    backgroundColor: '#FFFFFF',
    headerColor: '#FFFFFF',
  },
  fancy: {
    ...DEFAULT_STYLES,
    borderWidth: 2,
    borderColor: '#3B82F6',
    headerColor: '#3B82F6',
    textColor: '#FFFFFF',
    roundedCorners: true,
    hoverEffects: true,
  },
  dark: {
    ...DEFAULT_STYLES,
    backgroundColor: '#1F2937',
    headerColor: '#374151',
    textColor: '#F9FAFB',
    borderColor: '#4B5563',
  },
  corporate: {
    ...DEFAULT_STYLES,
    fontFamily: 'Arial',
    headerColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    stripedRows: false,
  },
};
