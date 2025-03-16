import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type SarQuery } from "@shared/schema";

interface PromptSearchProps {
  onSearch: (query: SarQuery) => void;
}

export function PromptSearch({ onSearch }: PromptSearchProps) {
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
    <Card className="fixed bottom-4 right-4 w-[400px] bg-background/95 backdrop-blur-sm border shadow-lg z-20">
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe what you're looking for..."
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
      </CardContent>
    </Card>
  );
}
