
import React from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Calendar, Users, MessageSquare } from "lucide-react";
import neetaImg from "@/components/images/Prof. Neeta Bhatt.jpeg";
import ramkrishnanImg from "@/components/images/Prof. Ramkrishnan Iyer.jpeg";
import rashmiImg from "@/components/images/Prof. Rashmi Pathak.jpeg";
import shwetaImg from "@/components/images/Prof. Shweta Nigam.jpeg";

const AboutPage: React.FC = () => {
  // Team members data
  const team = [
    {
      name: "Prof. Neeta Bhatt",
      role: "HOD",
      image: neetaImg,
    },
    {
      name: "Prof. Ramkrishnan Iyer",
      role: "Head professor",
      image: ramkrishnanImg,
    },
    {
      name: "Prof. Rashmi Pathak",
      role: "Events Coordinator/Discipline head",
      image: rashmiImg,
    },
    {
      name: "Prof. Shweta Nigam",
      role: "Technical Lead",
      image: shwetaImg,
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">About Campus Events Central</h1>
          <p className="text-xl text-gray-600">
            Connecting students with enriching campus experiences since 2023
          </p>
        </div>

        {/* Mission section */}
        <div className="bg-gradient-to-r from-purple-700 to-blue-500 text-white p-8 md:p-16 rounded-2xl mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              Campus Events Central aims to enhance student life by creating a centralized platform 
              for discovering, managing, and participating in campus events. We believe that 
              engagement in campus activities is a vital part of the college experience, 
              fostering community, personal growth, and lifelong memories.
            </p>
          </div>
        </div>

        {/* Features section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-card-effect">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-purple-100 rounded-full inline-flex mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Discovery</h3>
                <p className="text-gray-600">
                  Browse and search through a wide range of campus events, from academic lectures to social gatherings.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-card-effect">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-blue-100 rounded-full inline-flex mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple Registration</h3>
                <p className="text-gray-600">
                  Register for events with just a few clicks and manage all your event attendance in one place.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-card-effect">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-green-100 rounded-full inline-flex mb-4">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Organizer Tools</h3>
                <p className="text-gray-600">
                  Powerful tools for event organizers to create, promote, and manage successful campus events.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-card-effect">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-yellow-100 rounded-full inline-flex mb-4">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Feedback</h3>
                <p className="text-gray-600">
                  Share your thoughts on events you've attended to help improve future campus activities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 relative overflow-hidden rounded-full h-40 w-40 mx-auto">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
