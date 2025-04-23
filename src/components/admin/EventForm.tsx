
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  eventId?: string;
  onSuccess: () => void;
}

export function EventForm({ eventId, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      location: "",
      image_url: "",
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        setIsEditing(true);
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", eventId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Format the date for the input field
            const dateObj = new Date(data.date);
            const formattedDate = format(dateObj, "yyyy-MM-dd");
            
            form.reset({
              title: data.title,
              description: data.description,
              date: formattedDate,
              location: data.location,
              image_url: data.image_url || "",
            });
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          toast({
            title: "Failed to load event",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [eventId, form, toast]);

  const onSubmit = async (values: EventFormValues) => {
    setLoading(true);
    try {
      if (isEditing && eventId) {
        // Update existing event
        const { error } = await supabase
          .from("events")
          .update({
            title: values.title,
            description: values.description,
            date: values.date,
            location: values.location,
            image_url: values.image_url || null,
          })
          .eq("id", eventId);
        
        if (error) throw error;
        
        toast({
          title: "Event updated successfully",
        });
      } else {
        // Create new event
        const { error } = await supabase.from("events").insert({
          title: values.title,
          description: values.description,
          date: values.date,
          location: values.location,
          image_url: values.image_url || null,
        });
        
        if (error) throw error;
        
        toast({
          title: "Event created successfully",
        });
      }
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} event`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter event description" 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                      <Input placeholder="Enter event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg (optional)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a URL for the event image (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onSuccess();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
