import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sarQuerySchema, type SarImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Typography, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface SarQueryProps {
  onSearch: (params: any) => void;
}

export function SarQuery({ onSearch }: SarQueryProps) {
  // Set default dates - current date and 30 days ago
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const form = useForm({
    resolver: zodResolver(sarQuerySchema),
    defaultValues: {
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
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

  // Shared styled for date picker
  const datePickerSx = { 
    bgcolor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: 1,
    input: { color: 'white' },
    label: { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
    },
    '& .MuiIconButton-root': {
      color: 'rgba(255, 255, 255, 0.7)'
    },
    '& .MuiInputAdornment-root': {
      color: 'rgba(255, 255, 255, 0.7)'
    }
  };

  return (
    <div className="text-white">
      <Typography variant="h6" sx={{ mb: 2 }}>
        SAR Image Query
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker 
                      label="Start Date"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date.toISOString().split('T')[0]);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: datePickerSx
                        },
                        popper: {
                          sx: {
                            '& .MuiPickersDay-root': {
                              '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                              }
                            }
                          }
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker 
                      label="End Date"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date.toISOString().split('T')[0]);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          sx: datePickerSx
                        },
                        popper: {
                          sx: {
                            '& .MuiPickersDay-root': {
                              '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                              }
                            }
                          }
                        }
                      }}
                    />
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
      </LocalizationProvider>
    </div>
  );
}