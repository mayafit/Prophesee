import { useState } from "react";
import { type SarImage } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Eye,
  Plus,
  Loader2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";

interface SearchResultsTableProps {
  results: SarImage[];
  onImageSelect: (image: SarImage) => void;
  selectedImageId?: number;
  isLoading?: boolean;
  error?: Error | null;
}

export function SearchResultsTable({
  results,
  onImageSelect,
  selectedImageId,
  isLoading,
  error,
}: SearchResultsTableProps) {
  const [addedLayers, setAddedLayers] = useState<Set<number>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddLayer = (image: SarImage, event: React.MouseEvent) => {
    event.stopPropagation();
    onImageSelect(image);
    setAddedLayers((prev) => new Set(prev).add(image.id));
  };

  const formatLocation = (bbox: [number, number, number, number]) => {
    const centerLat = (bbox[1] + bbox[3]) / 2;
    const centerLon = (bbox[0] + bbox[2]) / 2;
    return `${centerLat.toFixed(3)}°N, ${centerLon.toFixed(3)}°E`;
  };

  const hasResults = !isLoading && !error && results.length > 0;
  const resultsCount = results.length;

  return (
    <Card
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-lg z-20 transition-all duration-300 rounded-none"
      style={{
        maxHeight: isCollapsed ? "40px" : "300px",
        transform: isCollapsed
          ? "translateY(calc(100% - 40px))"
          : "translateY(0)",
      }}
    >
      {/* Header bar with toggle button */}
      <div
        className="flex items-center justify-between p-2 px-4 bg-primary/10 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="font-medium">
            {isLoading
              ? "Searching..."
              : hasResults
                ? `Search Results (${resultsCount})`
                : "Search Results"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="p-1 h-6 w-6"
        >
          {isCollapsed ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Table content */}
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(300px - 40px)" }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Top-Left Coord</TableHead>
              <TableHead>Bottom-Right Coord</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Extent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching for SAR images...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error: {error.message}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : results.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No SAR images found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              results.map((image) => (
                <TableRow
                  key={image.id}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    selectedImageId === image.id
                      ? "bg-primary/10 ring-1 ring-primary"
                      : ""
                  }`}
                  onClick={() => onImageSelect(image)}
                >
                  <TableCell className="font-mono">{image.imageId}</TableCell>
                  <TableCell>
                    {format(new Date(image.timestamp), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="font-mono">
                    {image.bbox[3].toFixed(4)}°N, {image.bbox[0].toFixed(4)}°E
                  </TableCell>
                  <TableCell className="font-mono">
                    {image.bbox[1].toFixed(4)}°N, {image.bbox[2].toFixed(4)}°E
                  </TableCell>
                  <TableCell>
                    {image.metadata?.satellite ||
                      image.metadata?.source ||
                      "Unknown"}
                  </TableCell>
                  <TableCell>
                    {`${Math.abs(image.bbox[2] - image.bbox[0]).toFixed(2)}° × ${Math.abs(image.bbox[3] - image.bbox[1]).toFixed(2)}°`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageSelect(image);
                        }}
                        title="View image"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleAddLayer(image, e)}
                        title="Add as layer"
                        className={`flex items-center gap-1 ${addedLayers.has(image.id) ? "text-green-500 border-green-500" : ""}`}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Layer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
