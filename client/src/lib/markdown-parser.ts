import MarkdownIt from 'markdown-it';
import type { TableData } from '@/types/table-styles';

const md = new MarkdownIt();

export function parseMarkdownTable(markdown: string): TableData | null {
  try {
    const tokens = md.parse(markdown, {});
    
    // Find table tokens
    let tableOpenIndex = -1;
    let tableCloseIndex = -1;
    
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'table_open') {
        tableOpenIndex = i;
      }
      if (tokens[i].type === 'table_close') {
        tableCloseIndex = i;
        break;
      }
    }
    
    if (tableOpenIndex === -1 || tableCloseIndex === -1) {
      return null;
    }
    
    const tableTokens = tokens.slice(tableOpenIndex + 1, tableCloseIndex);
    
    const headers: string[] = [];
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let isHeader = true;
    
    for (const token of tableTokens) {
      if (token.type === 'thead_open') {
        isHeader = true;
      } else if (token.type === 'tbody_open') {
        isHeader = false;
      } else if (token.type === 'tr_open') {
        currentRow = [];
      } else if (token.type === 'tr_close') {
        if (isHeader && currentRow.length > 0) {
          headers.push(...currentRow);
        } else if (!isHeader && currentRow.length > 0) {
          rows.push([...currentRow]);
        }
        currentRow = [];
      } else if (token.type === 'td_open' || token.type === 'th_open') {
        // Start of cell content
      } else if (token.type === 'inline') {
        // Cell content
        currentRow.push(token.content || '');
      }
    }
    
    if (headers.length === 0 && rows.length === 0) {
      return null;
    }
    
    return { headers, rows };
  } catch (error) {
    console.error('Error parsing markdown table:', error);
    return null;
  }
}

export function generateSampleMarkdown(): string {
  return `| Name | Age | City | Occupation |
|------|-----|------|------------|
| John Doe | 25 | New York | Designer |
| Jane Smith | 30 | Los Angeles | Developer |
| Bob Johnson | 35 | Chicago | Manager |
| Alice Brown | 28 | Seattle | Analyst |`;
}

export function isValidMarkdownTable(markdown: string): boolean {
  const lines = markdown.trim().split('\n');
  if (lines.length < 2) return false;
  
  // Check if second line contains separator pattern
  const separatorPattern = /^\s*\|?[\s\-\|:]+\|?\s*$/;
  return separatorPattern.test(lines[1]);
}
