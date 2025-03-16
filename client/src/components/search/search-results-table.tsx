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
import { Eye, Plus, Loader2, AlertCircle } from "lucide-react";

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
  error 
}: SearchResultsTableProps) {
  const [addedLayers, setAddedLayers] = useState<Set<number>>(new Set());

  const handleAddLayer = (image: SarImage, event: React.MouseEvent) => {
    event.stopPropagation();
    onImageSelect(image);
    setAddedLayers(prev => new Set(prev).add(image.id));
  };

  const formatLocation = (bbox: [number, number, number, number]) => {
    const centerLat = (bbox[1] + bbox[3]) / 2;
    const centerLon = (bbox[0] + bbox[2]) / 2;
    return `${centerLat.toFixed(3)}°N, ${centerLon.toFixed(3)}°E`;
  };

  return (
    <Card className="absolute bottom-4 left-4 w-[900px] bg-background/95 backdrop-blur-sm border shadow-lg z-20">
      <div className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Extent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching for SAR images...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error: {error.message}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No SAR images found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              results.map((image) => (
                <TableRow 
                  key={image.id}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    selectedImageId === image.id ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => onImageSelect(image)}
                >
                  <TableCell className="font-mono">{image.imageId}</TableCell>
                  <TableCell>
                    {format(new Date(image.timestamp), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {formatLocation(image.bbox)}
                  </TableCell>
                  <TableCell>
                    {image.metadata?.satellite || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {`${Math.abs(image.bbox[2] - image.bbox[0]).toFixed(2)}° × ${Math.abs(image.bbox[3] - image.bbox[1]).toFixed(2)}°`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageSelect(image);
                        }}
                        title="View image"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleAddLayer(image, e)}
                        title="Add as layer"
                        className={addedLayers.has(image.id) ? "text-green-500" : ""}
                      >
                        <Plus className="h-4 w-4" />
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