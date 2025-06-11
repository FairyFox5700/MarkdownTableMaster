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

// Fallback suggestions when OpenAI API is unavailable
const getFallbackSuggestions = (tableData: TableData): StyleSuggestion[] => {
  const hasNumbers = tableData.rows.some(row => 
    row.some(cell => !isNaN(Number(cell)) && cell.trim() !== '')
  );
  
  const hasHeaders = tableData.headers.length > 0;
  const rowCount = tableData.rows.length;
  
  const suggestions: StyleSuggestion[] = [
    {
      name: "Professional Report",
      description: "Clean, business-ready styling with subtle borders and professional typography",
      reasoning: "Ideal for business reports and presentations with clear data hierarchy",
      category: "professional",
      styles: {
        fontFamily: "Inter",
        fontSize: 14,
        textColor: "#1F2937",
        backgroundColor: "#FFFFFF",
        headerColor: "#F8FAFC",
        borderColor: "#E2E8F0",
        borderStyle: "solid",
        borderWidth: 1,
        cellPadding: 12,
        textAlignment: hasNumbers ? "right" : "left",
        stripedRows: rowCount > 5,
        hoverEffects: true,
        headerStyling: true,
        roundedCorners: false
      }
    },
    {
      name: "Modern Minimal",
      description: "Clean design with no borders and ample spacing for a contemporary look",
      reasoning: "Perfect for modern dashboards and clean data presentations",
      category: "casual",
      styles: {
        fontFamily: "Inter",
        fontSize: 15,
        textColor: "#374151",
        backgroundColor: "#FFFFFF",
        headerColor: "#F9FAFB",
        borderColor: "#FFFFFF",
        borderStyle: "none",
        borderWidth: 0,
        cellPadding: 16,
        textAlignment: "left",
        stripedRows: false,
        hoverEffects: true,
        headerStyling: true,
        roundedCorners: true
      }
    },
    {
      name: "Data Dashboard",
      description: "Optimized for numerical data with right alignment and clear visual separation",
      reasoning: hasNumbers ? "Right-aligned for easy number comparison" : "Clean layout for data visualization",
      category: "technical",
      styles: {
        fontFamily: "Inter",
        fontSize: 13,
        textColor: "#111827",
        backgroundColor: "#FFFFFF",
        headerColor: "#EFF6FF",
        borderColor: "#D1D5DB",
        borderStyle: "solid",
        borderWidth: 1,
        cellPadding: 10,
        textAlignment: hasNumbers ? "right" : "center",
        stripedRows: true,
        hoverEffects: true,
        headerStyling: true,
        roundedCorners: false
      }
    },
    {
      name: "Creative Accent",
      description: "Vibrant styling with colored headers and rounded corners for visual appeal",
      reasoning: "Eye-catching design for presentations and creative content",
      category: "creative",
      styles: {
        fontFamily: "Inter",
        fontSize: 14,
        textColor: "#1F2937",
        backgroundColor: "#FFFFFF",
        headerColor: "#EBF4FF",
        borderColor: "#3B82F6",
        borderStyle: "solid",
        borderWidth: 2,
        cellPadding: 14,
        textAlignment: "left",
        stripedRows: false,
        hoverEffects: true,
        headerStyling: true,
        roundedCorners: true
      }
    }
  ];
  
  return suggestions;
};

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
    console.log('Using fallback suggestions due to API unavailability');
    return getFallbackSuggestions(tableData);
  }
}

// Fallback analysis when OpenAI API is unavailable
const getFallbackAnalysis = (tableData: TableData): {
  dataTypes: string[];
  purpose: string;
  recommendations: string[];
} => {
  const dataTypes: string[] = [];
  const recommendations: string[] = [];
  
  // Analyze data types
  const sampleCells = tableData.rows.flat().slice(0, 20);
  
  let hasNumbers = false;
  let hasDates = false;
  let hasPercentages = false;
  let hasText = false;
  
  sampleCells.forEach(cell => {
    const trimmed = cell.trim();
    if (!trimmed) return;
    
    if (!isNaN(Number(trimmed))) {
      hasNumbers = true;
    } else if (trimmed.includes('%')) {
      hasPercentages = true;
    } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$|^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      hasDates = true;
    } else {
      hasText = true;
    }
  });
  
  if (hasNumbers) dataTypes.push('numeric');
  if (hasText) dataTypes.push('text');
  if (hasDates) dataTypes.push('date');
  if (hasPercentages) dataTypes.push('percentage');
  
  // Generate purpose based on headers and content
  const headers = tableData.headers.map(h => h.toLowerCase());
  let purpose = 'Data table';
  
  if (headers.some(h => h.includes('sales') || h.includes('revenue') || h.includes('profit'))) {
    purpose = 'Financial/sales data table';
  } else if (headers.some(h => h.includes('user') || h.includes('customer') || h.includes('member'))) {
    purpose = 'User/customer data table';
  } else if (headers.some(h => h.includes('product') || h.includes('item') || h.includes('inventory'))) {
    purpose = 'Product/inventory table';
  } else if (hasNumbers && hasPercentages) {
    purpose = 'Performance metrics table';
  }
  
  // Generate recommendations
  if (hasNumbers) {
    recommendations.push('Right-align numeric columns for better readability');
  }
  if (tableData.rows.length > 5) {
    recommendations.push('Consider alternating row colors for easier scanning');
  }
  if (hasPercentages || hasNumbers) {
    recommendations.push('Use professional styling for data-focused presentation');
  }
  recommendations.push('Ensure adequate padding for comfortable reading');
  
  return {
    dataTypes,
    purpose,
    recommendations
  };
};

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
    console.log('Using fallback analysis due to API unavailability');
    return getFallbackAnalysis(tableData);
  }
}