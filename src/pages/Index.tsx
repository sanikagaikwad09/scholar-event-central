import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";

// Sample upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: "Tech Symposium 2025",
    date: "May 15, 2025",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Technology"
  },
  {
    id: 2,
    title: "Annual Cultural Fest",
    date: "June 5-7, 2025",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Cultural"
  },
  {
    id: 3,
    title: "Career Fair",
    date: "April 28, 2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Career"
  },
  {
    id: 4,
    title: "Sports Tournament",
    date: "May 22-24, 2025",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Sports"
  }
];

const Index: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-section relative text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Aditya Institute Of Management Studies & Research
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Your one-stop platform for discovering, managing, and participating in campus events
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events">
              <Button className="bg-teal-500 text-white hover:bg-teal-600 btn-hover-effect">
                Discover Events
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-transparent border-2 border-white hover:bg-white hover:text-teal-700 btn-hover-effect">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
            <Link to="/events" className="text-purple-600 hover:text-purple-800 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id}>
                <Card className="overflow-hidden hover-card-effect h-full">
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
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Aditya Institute Of Management Studies & Research</h2>
          <p className="text-lg text-gray-600 mb-8">
            Aditya Institute Of Management Studies & Research is the official event management platform for our college, 
            designed to connect students with exciting academic and social activities. 
            From workshops to cultural festivals, sports tournaments to career fairs, 
            discover, register, and participate in the vibrant campus life.
          </p>
          <Link to="/about">
            <Button variant="outline" className="btn-hover-effect">
              Learn More About Us
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
