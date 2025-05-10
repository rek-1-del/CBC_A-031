import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ArrowRight } from "lucide-react";
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
import { formatAISearchResult, formatSearchQuery, getMedicalDisclaimer } from "@/lib/utils/ai-helper";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    setIsDialogOpen(true);
    
    try {
      const response = await apiRequest('POST', '/api/ai/search', { query });
      const data = await response.json();
      setSearchResults(data.result);
    } catch (error) {
      toast({
        title: "Search error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      setSearchResults("Sorry, there was an error processing your query. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Ask a medical question..."
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
      <p className="text-xs text-neutral-500 mt-1">Powered by AI</p>
      
      {/* Results Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Medical AI Search Results
            </DialogTitle>
            <DialogDescription>
              AI-powered search on medical literature and resources
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
                <div className="p-4 border border-muted rounded-md bg-card">
                  <div dangerouslySetInnerHTML={{ 
                    __html: formatAISearchResult(searchResults.replace(/\n/g, '<br/>')) 
                  }}></div>
                  <div dangerouslySetInnerHTML={{ __html: getMedicalDisclaimer() }}></div>
                </div>
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
                // Open in a new search
                window.open(`https://www.ncbi.nlm.nih.gov/search/all/?term=${encodeURIComponent(query)}`, '_blank');
              }}
              className="flex items-center"
            >
              Search PubMed
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
