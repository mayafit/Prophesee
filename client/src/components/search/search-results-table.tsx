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
import { format } from "date-fns";

interface SearchResultsTableProps {
  results: SarImage[];
  onImageSelect: (image: SarImage) => void;
  selectedImageId?: number;
}

export function SearchResultsTable({ results, onImageSelect, selectedImageId }: SearchResultsTableProps) {
  return (
    <Card className="absolute bottom-4 left-4 w-96 bg-background/95 backdrop-blur-sm border shadow-lg z-20">
      <div className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Coverage</TableHead>
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
                <TableCell>{image.imageId}</TableCell>
                <TableCell>{format(new Date(image.timestamp), 'MMM d, yyyy')}</TableCell>
                <TableCell>{`${image.bbox[0].toFixed(2)}°, ${image.bbox[1].toFixed(2)}°`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
