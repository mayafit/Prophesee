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
import { Eye } from "lucide-react";

interface SearchResultsTableProps {
  results: SarImage[];
  onImageSelect: (image: SarImage) => void;
  selectedImageId?: number;
}

export function SearchResultsTable({ results, onImageSelect, selectedImageId }: SearchResultsTableProps) {
  return (
    <Card className="absolute bottom-4 left-4 w-[900px] bg-background/95 backdrop-blur-sm border shadow-lg z-20">
      <div className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Top-Left</TableHead>
              <TableHead>Bottom-Right</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((image) => (
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
                  {`${image.bbox[0].toFixed(3)}°, ${image.bbox[3].toFixed(3)}°`}
                </TableCell>
                <TableCell>
                  {`${image.bbox[2].toFixed(3)}°, ${image.bbox[1].toFixed(3)}°`}
                </TableCell>
                <TableCell>
                  {image.metadata.satellite || 'Unknown'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageSelect(image);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}