import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type SarQuery } from "@shared/schema";

interface SearchPanelProps {
  onSearch: (query: SarQuery) => void;
}

export function SearchPanel({ onSearch }: SearchPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze prompt");
      }

      const query = await response.json();
      onSearch(query);
      
      toast({
        title: "Query translated",
        description: "Your prompt has been converted to a search query.",
      });
    } catch (error) {
      console.error("Error analyzing prompt:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze your search prompt. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Enter a natural language description of what you're looking for
      </p>
      
      <div className="flex gap-2">
        <Input
          placeholder="e.g., recent floods in California"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground pt-2 space-y-1">
        <p><strong>Try these examples:</strong></p>
        <ul className="pl-4 list-disc">
          <li>Flooding in New York in March</li>
          <li>Wildfires in California this week</li>
          <li>Recent images of Los Angeles</li>
        </ul>
      </div>
    </div>
  );
}