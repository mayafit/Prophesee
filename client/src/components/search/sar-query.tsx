import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sarQuerySchema, type SarImage } from "@shared/schema";
import { 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent,
  Skeleton,
  Box
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export function SarQuery() {
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
  }

  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        SAR Image Query
      </Typography>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          fullWidth
          type="date"
          label="Start Date"
          {...form.register("startDate")}
          sx={{
            mb: 2,
            input: { color: 'white' },
            label: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            }
          }}
        />

        <TextField
          fullWidth
          type="date"
          label="End Date"
          {...form.register("endDate")}
          sx={{
            mb: 2,
            input: { color: 'white' },
            label: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            }
          }}
        />

        <Button 
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<SearchIcon />}
          sx={{ mt: 2 }}
        >
          Search Images
        </Button>
      </form>

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