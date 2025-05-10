/**
 * Helper functions for the search functionality
 */

export type GoogleSearchResult = {
  title: string;
  link: string;
  snippet: string;
  formattedUrl: string;
};

/**
 * Formats a search query for better display in the search interface
 * 
 * @param query The search query text
 * @returns Formatted HTML for displaying the query
 */
export function formatSearchQuery(query: string): string {
  return `
    <div class="mb-4">
      <h3 class="text-lg font-medium">Query: "${query}"</h3>
    </div>
  `;
}

/**
 * Returns a medical disclaimer to display with search results
 * 
 * @returns HTML string with medical disclaimer
 */
export function getSearchDisclaimer(): string {
  return `
    <div class="mt-6 text-xs text-muted-foreground border-t pt-4">
      <p class="font-medium">Medical Disclaimer:</p>
      <p>Search results are provided for informational purposes only and should not replace professional medical advice.
      Always consult with a qualified healthcare provider for medical decisions.</p>
    </div>
  `;
}