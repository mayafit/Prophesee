import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sarQuerySchema, type SarImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Typography } from "@mui/material";

interface SarQueryProps {
  onSearch: (params: any) => void;
}

export function SarQuery({ onSearch }: SarQueryProps) {
  const form = useForm({
    resolver: zodResolver(sarQuerySchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      limit: 10
    }
  });

  function onSubmit(data: any) {
    // Format dates to ISO strings for API
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString()
    };
    onSearch(formattedData);
  }

  return (
    <div className="text-white">
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
    </div>
  );
}