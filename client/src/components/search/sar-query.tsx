import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sarQuerySchema, type SarImage, type SarSupplier } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Typography, TextField, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
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
  
  // Available suppliers for selection
  const availableSuppliers: { value: SarSupplier, label: string, description: string }[] = [
    { value: "capella", label: "Capella Space", description: "Commercial SAR imagery provider" },
    { value: "sentinel", label: "Sentinel", description: "European Space Agency SAR data" },
    { value: "planetscope", label: "PlanetScope", description: "High-frequency Earth imaging" },
    { value: "landsat", label: "Landsat", description: "NASA/USGS Earth observation" },
    { value: "iceye", label: "ICEYE", description: "Commercial SAR satellite constellation" },
    { value: "other", label: "Other Sources", description: "Additional imagery sources" }
  ];
  
  // State for supplier selection (with capella as default)
  const [selectedSuppliers, setSelectedSuppliers] = useState<SarSupplier[]>(["capella"]);
  
  const form = useForm({
    resolver: zodResolver(sarQuerySchema),
    defaultValues: {
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      limit: 10,
      suppliers: ["capella"] as SarSupplier[]
    }
  });

  // Handle supplier checkbox changes
  const handleSupplierChange = (supplier: SarSupplier, checked: boolean) => {
    let newSuppliers: SarSupplier[];
    
    if (checked) {
      // Add the supplier if it's checked
      newSuppliers = [...selectedSuppliers, supplier];
    } else {
      // Remove the supplier if it's unchecked
      newSuppliers = selectedSuppliers.filter(s => s !== supplier);
    }
    
    // Update both the state and form
    setSelectedSuppliers(newSuppliers);
    form.setValue('suppliers', newSuppliers);
  };

  function onSubmit(data: any) {
    // Format dates to ISO strings for API
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      suppliers: selectedSuppliers // Ensure we use the selected suppliers
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

            <FormItem>
              <FormLabel>Data Suppliers</FormLabel>
              <FormControl>
                <div className="bg-opacity-10 bg-white rounded-md p-3">
                  <FormGroup>
                    {availableSuppliers.map((supplier) => (
                      <FormControlLabel
                        key={supplier.value}
                        control={
                          <Checkbox
                            checked={selectedSuppliers.includes(supplier.value)}
                            onChange={(e) => handleSupplierChange(supplier.value, e.target.checked)}
                            sx={{
                              color: 'rgba(255,255,255,0.7)',
                              '&.Mui-checked': {
                                color: 'white',
                              },
                            }}
                          />
                        }
                        label={
                          <div className="flex flex-col">
                            <span className="text-white text-sm">{supplier.label}</span>
                            <span className="text-gray-400 text-xs">{supplier.description}</span>
                          </div>
                        }
                        sx={{
                          margin: '0.25rem 0',
                          '.MuiFormControlLabel-label': {
                            fontSize: '0.9rem',
                          }
                        }}
                      />
                    ))}
                  </FormGroup>
                </div>
              </FormControl>
            </FormItem>

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