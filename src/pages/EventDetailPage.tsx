
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { EventRegistrationForm } from "@/components/EventRegistrationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Download, Users, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        console.log("Fetching event with ID:", id);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (eventError) {
          console.error("Error fetching event:", eventError);
          throw eventError;
        }

        console.log("Event data:", eventData);
        setEvent(eventData);

        // Fetch registration count
        if (eventData) {
          const { data: registrations, error: countError } = await supabase
            .from("event_registrations")
            .select("id")
            .eq("event_id", id);

          if (countError) {
            console.error("Error fetching registration count:", countError);
          } else {
            setRegistrationCount(registrations?.length || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false);
    setRegistrationCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-80 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
            <div className="grid grid-cols-1 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-60 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Format the date for display
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-gray-500 mb-6">
            <Link to="/events" className="hover:text-purple-600">Events</Link>
            <span className="mx-2">›</span>
            <span>{event.title}</span>
          </div>
          
          <div className="mb-8">
            <div className="relative h-80 rounded-xl overflow-hidden mb-6">
              <img 
                src={event.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  Event
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{registrationCount} registered</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Event Details</h3>
                  <p className="text-gray-600">Click register to join this event</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
                  {showRegistrationForm ? (
                    <Button onClick={() => setShowRegistrationForm(false)} variant="outline">
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button onClick={() => setShowRegistrationForm(true)} className="bg-purple-600 hover:bg-purple-700">
                      Register Now
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {showRegistrationForm && (
            <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Register for {event.title}</h2>
              <EventRegistrationForm 
                eventId={event.id} 
                eventTitle={event.title}
                onSuccess={handleRegistrationSuccess}
              />
            </div>
          )}
          
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-6 bg-white shadow-sm rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailPage;
