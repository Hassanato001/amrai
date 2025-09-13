
export interface Suggestion {
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface AnalysisResult {
  html: Suggestion[];
  css: Suggestion[];
  javascript: Suggestion[];
  ui_ux: Suggestion[];
  performance: Suggestion[];
  accessibility: Suggestion[];
}
