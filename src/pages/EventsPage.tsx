
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, List, Calendar, Search } from "lucide-react";

// Sample events data
const eventsData = [
  {
    id: 1,
    title: "Tech Symposium 2025",
    date: "May 15, 2025",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Technology",
    description: "A full-day symposium featuring tech talks, workshops, and networking opportunities with industry professionals.",
    location: "Main Auditorium"
  },
  {
    id: 2,
    title: "Annual Cultural Fest",
    date: "June 5-7, 2025",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    description: "Three days of music, dance, art, and cultural celebrations featuring performances from students and guest artists.",
    location: "Campus Grounds"
  },
  {
    id: 3,
    title: "Career Fair",
    date: "April 28, 2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Career",
    description: "Meet recruiters from top companies and explore internship and job opportunities in various industries.",
    location: "Student Center"
  },
  {
    id: 4,
    title: "Sports Tournament",
    date: "May 22-24, 2025",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Sports",
    description: "Inter-college sports competition featuring basketball, soccer, tennis, and swimming events.",
    location: "Sports Complex"
  },
  {
    id: 5,
    title: "Research Symposium",
    date: "June 12, 2025",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Academic",
    description: "Showcase of student and faculty research projects with presentations and poster sessions.",
    location: "Science Building"
  },
  {
    id: 6,
    title: "Alumni Networking Night",
    date: "July 8, 2025",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Networking",
    description: "Connect with successful alumni and build your professional network while enjoying refreshments.",
    location: "Business School Lounge"
  },
  {
    id: 7,
    title: "Hackathon 2025",
    date: "May 30-31, 2025",
    image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Technology",
    description: "48-hour coding competition to build innovative solutions to real-world problems. Open to all skill levels.",
    location: "Engineering Building"
  },
  {
    id: 8,
    title: "Volunteer Day",
    date: "April 22, 2025",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Community",
    description: "Join fellow students in community service projects around campus and the local area.",
    location: "Campus Quad"
  }
];

// Categories for filtering
const categories = [
  "All Categories",
  "Technology",
  "Cultural",
  "Career",
  "Sports",
  "Academic",
  "Networking",
  "Community"
];

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState("grid");

  // Filter events based on search query and category
  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Event Listings</h1>
            <p className="text-gray-600 mt-2">
              Discover and register for upcoming events on campus
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Link to={`/events/${event.id}`} key={event.id}>
                      <Card className="overflow-hidden h-full hover-card-effect">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {event.category}
                          </span>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center text-gray-500 mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">{event.date}</span>
                          </div>
                          <p className="text-gray-600 line-clamp-2">{event.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">View Details</Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <Link to={`/events/${event.id}`} key={event.id}>
                      <Card className="overflow-hidden hover-card-effect">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="md:w-3/4 p-4">
                            <div className="mb-2">
                              <h3 className="text-xl font-semibold">{event.title}</h3>
                              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                {event.category}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 mb-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="text-sm">{event.date}</span>
                              <span className="mx-2">•</span>
                              <span className="text-sm">{event.location}</span>
                            </div>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <Button variant="outline">View Details</Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default EventsPage;
