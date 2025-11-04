"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { handleGenerateDescription } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  propertyType: z.string().min(2, "Property type is required."),
  location: z.string().min(2, "Location is required."),
  amenities: z.string().min(5, "List at least one amenity."),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewPropertyForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "",
      location: "",
      amenities: "",
      description: "",
    },
  });

  const handleGenerate = () => {
    const { propertyType, location, amenities } = form.getValues();

    if (!propertyType || !location || !amenities) {
      toast({
        title: "Missing Information",
        description: "Please fill in Property Type, Location, and Amenities to generate a description.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await handleGenerateDescription({
        propertyType,
        location,
        amenities,
      });

      if (result.success) {
        if (typeof result.description === 'string') {
          form.setValue("description", result.description);
        }
        toast({
          title: "Description Generated!",
          description: "The AI has generated a description for your property.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  function onSubmit(values: FormValues) {
    // Post to server API that writes to Supabase using service role key
    fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: values.propertyType + ' in ' + values.location,
        slug: values.propertyType.toLowerCase().replace(/\s+/g,'-') + '-' + Date.now().toString(36),
        description: values.description,
        short_description: values.description?.slice(0, 160),
        city: values.location,
        price: 0
      })
    }).then(async (res) => {
      const json = await res.json();
      if (res.ok) {
        toast({ title: 'Property Submitted!', description: 'Your property was saved.' });
        form.reset();
      } else {
        toast({ title: 'Error', description: json.error || 'Failed to save property', variant: 'destructive' });
      }
    }).catch((err) => {
      toast({ title: 'Error', description: err.message || 'Failed to save property', variant: 'destructive' });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., PG, Hostel, Shared Flat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Koregaon Park, Pune" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Wifi, AC, Power Backup, Meals" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a comma-separated list of amenities.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Property Description</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isPending}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isPending ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Describe your property..."
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit Property</Button>
        </CardFooter>
      </form>
    </Form>
  );
}
