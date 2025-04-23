
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
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

// Sample events data
const eventsData = [
  {
    id: "1",
    title: "Tech Symposium 2025",
    date: "May 15, 2025",
    time: "9:00 AM - 5:00 PM",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Technology",
    description: "A full-day symposium featuring tech talks, workshops, and networking opportunities with industry professionals.",
    location: "Main Auditorium",
    organizer: "Computer Science Department",
    attendees: 127,
    maxAttendees: 200,
    schedule: [
      { time: "9:00 AM - 10:00 AM", title: "Registration & Breakfast" },
      { time: "10:00 AM - 11:30 AM", title: "Keynote: The Future of AI" },
      { time: "11:45 AM - 12:45 PM", title: "Panel Discussion: Tech Ethics" },
      { time: "1:00 PM - 2:00 PM", title: "Lunch Break" },
      { time: "2:15 PM - 3:45 PM", title: "Workshop Sessions (Multiple Tracks)" },
      { time: "4:00 PM - 5:00 PM", title: "Networking Reception" }
    ],
    resources: [
      { name: "Event Schedule PDF", type: "pdf", url: "#" },
      { name: "Campus Map", type: "pdf", url: "#" },
      { name: "Speaker Biographies", type: "pdf", url: "#" }
    ]
  },
  {
    id: "2",
    title: "Annual Cultural Fest",
    date: "June 5-7, 2025",
    time: "Various times",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    description: "Three days of music, dance, art, and cultural celebrations featuring performances from students and guest artists.",
    location: "Campus Grounds",
    organizer: "Student Activities Board",
    attendees: 342,
    maxAttendees: 1000,
    schedule: [
      { time: "Day 1 - 10:00 AM", title: "Opening Ceremony" },
      { time: "Day 1 - 12:00 PM", title: "Cultural Performances" },
      { time: "Day 1 - 7:00 PM", title: "Concert Night" },
      { time: "Day 2 - 11:00 AM", title: "Art Exhibition" },
      { time: "Day 2 - 3:00 PM", title: "Dance Competition" },
      { time: "Day 2 - 8:00 PM", title: "Theater Performance" },
      { time: "Day 3 - 12:00 PM", title: "Food Festival" },
      { time: "Day 3 - 6:00 PM", title: "Closing Ceremony" }
    ],
    resources: [
      { name: "Festival Program", type: "pdf", url: "#" },
      { name: "Performance Schedule", type: "pdf", url: "#" },
      { name: "Food Vendor List", type: "pdf", url: "#" }
    ]
  }
];

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch the event data from your API
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundEvent = eventsData.find(e => e.id === id);
        setEvent(foundEvent || null);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = () => {
    toast({
      title: "Registration Successful",
      description: `You have registered for ${event?.title}. Check your email for confirmation.`,
    });
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link to="/events" className="hover:text-purple-600">Events</Link>
            <span className="mx-2">›</span>
            <span>{event.title}</span>
          </div>
          
          {/* Event Header */}
          <div className="mb-8">
            <div className="relative h-80 rounded-xl overflow-hidden mb-6">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  {event.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{event.attendees}/{event.maxAttendees} registered</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Organized by</h3>
                  <p className="text-gray-600">{event.organizer}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
                  <Button onClick={handleRegister} className="bg-purple-600 hover:bg-purple-700 btn-hover-effect">
                    Register Now
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Details Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-6 bg-white shadow-sm rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </TabsContent>
            <TabsContent value="schedule" className="p-6 bg-white shadow-sm rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Event Schedule</h2>
              <div className="space-y-4">
                {event.schedule.map((item: any, index: number) => (
                  <div key={index} className="flex border-l-4 border-purple-600 pl-4">
                    <div className="min-w-[140px] font-medium text-gray-900">{item.time}</div>
                    <div>{item.title}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resources" className="p-6 bg-white shadow-sm rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Event Resources</h2>
              <div className="space-y-3">
                {event.resources.map((resource: any, index: number) => (
                  <a
                    key={index}
                    href={resource.url}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Download className="h-5 w-5 mr-3 text-purple-600" />
                    <span>{resource.name}</span>
                  </a>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Related Events */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventsData
                .filter(e => e.id !== event.id)
                .slice(0, 2)
                .map(relatedEvent => (
                  <Link to={`/events/${relatedEvent.id}`} key={relatedEvent.id}>
                    <Card className="overflow-hidden h-full hover-card-effect">
                      <div className="h-36 overflow-hidden">
                        <img 
                          src={relatedEvent.image} 
                          alt={relatedEvent.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{relatedEvent.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex items-center text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">{relatedEvent.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailPage;
