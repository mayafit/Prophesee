import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sarQuerySchema, type SarImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function SarQuery() {
  const { toast } = useToast();
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">SAR Image Query</h3>
      
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
            Search Images
          </Button>
        </form>
      </Form>

      <div className="space-y-2">
        {isLoading && (
          <Card className="p-4">
            <Skeleton className="h-20 w-full" />
          </Card>
        )}
        
        {sarImages?.map((image) => (
          <Card key={image.id} className="p-4">
            <p className="font-medium">{image.imageId}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(image.timestamp).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
