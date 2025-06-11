import OpenAI from "openai";
import type { TableData, TableStyles } from "@shared/../client/src/types/table-styles";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface StyleSuggestion {
  name: string;
  description: string;
  reasoning: string;
  styles: Partial<TableStyles>;
  category: 'professional' | 'casual' | 'technical' | 'creative';
}

export async function generateTableStyleSuggestions(
  tableData: TableData,
  markdownContent: string
): Promise<StyleSuggestion[]> {
  try {
    const prompt = `Analyze this markdown table and provide 3-4 intelligent styling suggestions:

Table Data:
Headers: ${JSON.stringify(tableData.headers)}
Rows: ${JSON.stringify(tableData.rows.slice(0, 5))} ${tableData.rows.length > 5 ? '... (truncated)' : ''}

Markdown:
${markdownContent}

Based on the table content, data types, and purpose, suggest styling options. Consider:
- Data type (numerical, text, dates, financial, etc.)
- Table purpose (dashboard, report, presentation, documentation)
- Professional vs casual context
- Readability and visual hierarchy

Respond with JSON in this exact format:
{
  "suggestions": [
    {
      "name": "Style Name",
      "description": "Brief description for user",
      "reasoning": "Why this style works for this data",
      "category": "professional|casual|technical|creative",
      "styles": {
        "fontFamily": "Inter",
        "fontSize": 14,
        "textColor": "#1F2937",
        "backgroundColor": "#FFFFFF",
        "headerColor": "#F9FAFB",
        "borderColor": "#E5E7EB",
        "borderStyle": "solid",
        "borderWidth": 1,
        "cellPadding": 12,
        "textAlignment": "left",
        "stripedRows": true,
        "hoverEffects": false,
        "headerStyling": true,
        "roundedCorners": false
      }
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert UI/UX designer specializing in data presentation and table formatting. Provide practical, visually appealing styling suggestions based on table content analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating style suggestions:', error);
    throw new Error('Failed to generate AI style suggestions');
  }
}

export async function analyzeTableContent(tableData: TableData): Promise<{
  dataTypes: string[];
  purpose: string;
  recommendations: string[];
}> {
  try {
    const prompt = `Analyze this table data and provide insights:

Headers: ${JSON.stringify(tableData.headers)}
Sample Data: ${JSON.stringify(tableData.rows.slice(0, 3))}

Analyze and respond with JSON:
{
  "dataTypes": ["text", "numeric", "date", "percentage", etc.],
  "purpose": "brief description of table purpose",
  "recommendations": ["styling recommendation 1", "recommendation 2", etc.]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a data analysis expert. Analyze table structure and content to provide formatting insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 800
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      dataTypes: result.dataTypes || [],
      purpose: result.purpose || 'General data table',
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error('Error analyzing table content:', error);
    throw new Error('Failed to analyze table content');
  }
}