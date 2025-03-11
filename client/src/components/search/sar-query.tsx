import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sarQuerySchema, type SarImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  Typography,
} from "@mui/material";

interface SarQueryProps {
  onSearch: (params: any) => void;
}

export function SarQuery({ onSearch }: SarQueryProps) {
  const [queryParams, setQueryParams] = useState<any>(null);
  const form = useForm({
    resolver: zodResolver(sarQuerySchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      limit: 10
    }
  });

  const { data: sarImages, isLoading } = useQuery<SarImage[]>({
    queryKey: ['/api/sar-images', queryParams],
    enabled: !!queryParams,
  });

  function onSubmit(data: any) {
    setQueryParams(data);
    onSearch(data); // Call onSearch prop to trigger external search functionality
  }

  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        SAR Image Query
      </Typography>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Images
          </Button>
        </form>
      </Form>

      <Box sx={{ mt: 4 }}>
        {isLoading && (
          <Card sx={{ mb: 2, bgcolor: 'rgba(30, 41, 59, 0.8)' }}>
            <CardContent>
              <Skeleton variant="rectangular" height={80} />
            </CardContent>
          </Card>
        )}

        {sarImages?.map((image) => (
          <Card
            key={image.id}
            sx={{
              mb: 2,
              bgcolor: 'rgba(30, 41, 59, 0.8)',
              color: 'white'
            }}
          >
            <CardContent>
              <Typography variant="subtitle1">
                {image.imageId}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {new Date(image.timestamp).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}