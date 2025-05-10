import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatSearchQuery, getSearchDisclaimer, type GoogleSearchResult } from "@/lib/utils/search-helper";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    setIsDialogOpen(true);
    
    try {
      const response = await apiRequest('POST', '/api/search', { query });
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      toast({
        title: "Search error",
        description: "Failed to get search results. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search medical information..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-primary"
          disabled={isSearching}
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
      <p className="text-xs text-neutral-500 mt-1">Powered by Google Search</p>
      
      {/* Results Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Medical Search Results
            </DialogTitle>
            <DialogDescription>
              Search results from medical websites and resources
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-neutral-500">Searching medical databases...</p>
                <p className="text-xs text-neutral-400 mt-2">This may take a few moments...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatSearchQuery(query) }}></div>
                
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="p-4 border border-muted rounded-md bg-card hover:bg-accent/10 transition-colors cursor-pointer"
                        onClick={() => openInNewTab(result.link)}
                      >
                        <h3 className="text-base font-medium text-primary flex items-center">
                          {result.title}
                          <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1">{result.formattedUrl}</p>
                        <p className="text-sm">{result.snippet}</p>
                      </div>
                    ))}
                    <div dangerouslySetInnerHTML={{ __html: getSearchDisclaimer() }}></div>
                  </div>
                ) : !isSearching && (
                  <div className="p-4 border border-muted rounded-md bg-card">
                    <p className="text-center">No results found for your query. Please try different keywords.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="mr-2"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                // Open in a new Google search tab
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query + " medical research")}`, '_blank');
              }}
              className="flex items-center"
            >
              Search Google
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
