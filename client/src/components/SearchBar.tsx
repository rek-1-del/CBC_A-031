import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
            <DialogTitle>Medical AI Search Results</DialogTitle>
            <DialogDescription>
              Search query: {query}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-neutral-500">Searching medical databases...</p>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: searchResults.replace(/\n/g, '<br/>') }}></div>
                <p className="text-xs text-muted-foreground mt-6">
                  Note: AI-generated content should not replace professional medical advice. 
                  Always consult with a healthcare provider for medical decisions.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
