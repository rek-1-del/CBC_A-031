/**
 * Google Search API integration for medical searches
 */

type GoogleSearchResult = {
  title: string;
  link: string;
  snippet: string;
  formattedUrl: string;
};

type GoogleSearchResponse = {
  items?: {
    title: string;
    link: string;
    snippet: string;
    formattedUrl: string;
  }[];
  searchInformation?: {
    totalResults: string;
    formattedSearchTime: string;
  };
  error?: {
    code: number;
    message: string;
  };
};

/**
 * Perform a Google search using the Custom Search JSON API
 * 
 * @param query The search query
 * @returns Promise with search results
 */
export async function performGoogleSearch(query: string): Promise<GoogleSearchResult[]> {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX_ID;
    
    if (!apiKey || !cx) {
      throw new Error("Google Search API key or CX ID not configured");
    }

    // Add medical terms to improve search quality
    const medicalQuery = `${query} medical research`;
    
    // Build the URL for the Google Custom Search API
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('cx', cx);
    url.searchParams.append('q', medicalQuery);
    url.searchParams.append('num', '10');  // Number of results to return (max 10)
    
    // Make the API request
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Search API error:", errorData);
      throw new Error(`Google Search API error: ${response.status}`);
    }
    
    const data = await response.json() as GoogleSearchResponse;
    
    // Return search results or empty array if no results
    return data.items || [];
    
  } catch (error) {
    console.error("Google search error:", error);
    throw new Error("Failed to get search results. Please try again later.");
  }
}