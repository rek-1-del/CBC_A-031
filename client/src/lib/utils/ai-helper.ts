/**
 * Formats an AI search result with proper citation styling and enhanced rendering
 * 
 * @param result The HTML string result from the AI search
 * @returns Processed HTML with citation formatting and syntax highlighting
 */
export function formatAISearchResult(result: string): string {
  // Add citation formatting
  let formattedResult = result.replace(
    /\[([1-9][0-9]*)\]/g, 
    '<sup class="text-primary font-medium">[&nbsp;$1&nbsp;]</sup>'
  );
  
  // Add visual styling for medical terms
  const medicalTerms = [
    "diagnos(is|es|ed|ing)",
    "treatment(s)?",
    "symptom(s)?",
    "patient(s)?",
    "disease(s)?",
    "syndrome(s)?",
    "prognos(is|es)",
    "therap(y|ies|eutic)",
    "patholog(y|ies|ical)",
    "chronic",
    "acute",
    "clinical",
    "medicin(e|es|al)"
  ];
  
  const medicalTermPattern = new RegExp(`\\b(${medicalTerms.join("|")})\\b`, "gi");
  formattedResult = formattedResult.replace(
    medicalTermPattern,
    '<span class="text-primary font-medium">$1</span>'
  );
  
  return formattedResult;
}

/**
 * Formats a search query for better display in the AI search interface
 * 
 * @param query The search query text
 * @returns Formatted HTML for displaying the query in a professional manner
 */
export function formatSearchQuery(query: string): string {
  // Add visual styling for the search query
  return `
    <div class="py-2 px-3 bg-muted rounded-md mb-4">
      <p class="font-medium">Query: ${query}</p>
    </div>
  `;
}

/**
 * Adds a disclaimer to AI search results
 * 
 * @returns HTML string with medical disclaimer
 */
export function getMedicalDisclaimer(): string {
  return `
    <div class="mt-6 pt-4 border-t border-muted text-xs text-muted-foreground">
      <p class="font-medium">Medical Disclaimer:</p>
      <p>The information provided is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
    </div>
  `;
}