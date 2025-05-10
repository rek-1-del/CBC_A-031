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

    console.log("Using Google Search API with key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5));
    console.log("Using CX ID:", cx.substring(0, 5) + "..." + cx.substring(cx.length - 5));

    // Add medical terms to improve search quality
    const medicalQuery = `${query} medical research`;
    
    // Build the URL for the Google Custom Search API
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('cx', cx);
    url.searchParams.append('q', medicalQuery);
    url.searchParams.append('num', '5');  // Number of results to return (max 10)
    
    // For debugging
    console.log("Sending request to:", url.toString().replace(apiKey, "[REDACTED]"));
    
    // Make the API request
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Search API error:", errorData);
      
      // Return mock results for testing UI
      if (process.env.NODE_ENV === 'development') {
        console.log("Returning mock results for development");
        return [
          {
            title: "Heart Disease - Symptoms and causes - Mayo Clinic",
            link: "https://www.mayoclinic.org/diseases-conditions/heart-disease/symptoms-causes/syc-20353118",
            snippet: "Heart disease symptoms depend on what type of heart disease you have. Symptoms of heart disease in the blood vessels (atherosclerotic disease).",
            formattedUrl: "www.mayoclinic.org/.../heart-disease/symptoms-causes/syc-20353118"
          },
          {
            title: "Heart Attack: Symptoms, Warning Signs, Causes & Treatments",
            link: "https://my.clevelandclinic.org/health/diseases/16818-heart-attack-myocardial-infarction",
            snippet: "Heart attack symptoms include chest pain or discomfort, shortness of breath, cold sweats, and nausea. Treatments include medications and cardiac procedures.",
            formattedUrl: "my.clevelandclinic.org/.../heart-attack-myocardial-infarction"
          }
        ];
      }
      
      throw new Error(`Google Search API error: ${response.status}`);
    }
    
    const data = await response.json() as GoogleSearchResponse;
    
    // Return search results or empty array if no results
    return data.items || [];
    
  } catch (error) {
    console.error("Google search error:", error);
    
    // Return mock results for testing UI (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("Returning mock results for development");
      return [
        {
          title: "Heart Disease - Symptoms and causes - Mayo Clinic",
          link: "https://www.mayoclinic.org/diseases-conditions/heart-disease/symptoms-causes/syc-20353118",
          snippet: "Heart disease symptoms depend on what type of heart disease you have. Symptoms of heart disease in the blood vessels (atherosclerotic disease).",
          formattedUrl: "www.mayoclinic.org/.../heart-disease/symptoms-causes/syc-20353118"
        },
        {
          title: "Heart Attack: Symptoms, Warning Signs, Causes & Treatments",
          link: "https://my.clevelandclinic.org/health/diseases/16818-heart-attack-myocardial-infarction",
          snippet: "Heart attack symptoms include chest pain or discomfort, shortness of breath, cold sweats, and nausea. Treatments include medications and cardiac procedures.",
          formattedUrl: "my.clevelandclinic.org/.../heart-attack-myocardial-infarction"
        }
      ];
    }
    
    throw new Error("Failed to get search results. Please try again later.");
  }
}