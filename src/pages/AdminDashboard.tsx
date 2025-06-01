
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsList } from "@/components/admin/EventsList";
import { EventForm } from "@/components/admin/EventForm";
import { RegisteredStudents } from "@/components/admin/RegisteredStudents";
import { StudentsRegistrations } from "@/components/admin/StudentsRegistrations";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate('/admin/login');
      return;
    }
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges to access this page",
        variant: "destructive",
      });
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center h-40">
                <p>Loading dashboard...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) return null;

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="registrations">Registrations</TabsTrigger>
              <TabsTrigger value="events-list">Events</TabsTrigger>
              <TabsTrigger value="add-event">Add Event</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>System overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">• Registered students</p>
                    <p className="text-sm">• Event registrations</p>
                    <p className="text-sm">• Upcoming events</p>
                    <p className="text-sm">• Gallery photos</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Recent registrations and events will appear here</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm cursor-pointer text-blue-600 hover:underline" 
                     onClick={() => setActiveTab("add-event")}>
                    → Add New Event
                  </p>
                  <p className="text-sm cursor-pointer text-blue-600 hover:underline"
                     onClick={() => setActiveTab("students")}>
                    → View Students
                  </p>
                  <p className="text-sm cursor-pointer text-blue-600 hover:underline"
                     onClick={() => setActiveTab("gallery")}>
                    → Manage Gallery
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4">
            <RegisteredStudents />
          </TabsContent>
          
          <TabsContent value="registrations" className="space-y-4">
            <StudentsRegistrations />
          </TabsContent>
          
          <TabsContent value="events-list" className="space-y-4">
            <EventsList onEditEvent={() => setActiveTab("add-event")} />
          </TabsContent>
          
          <TabsContent value="add-event">
            <EventForm onSuccess={() => setActiveTab("events-list")} />
          </TabsContent>
          
          <TabsContent value="gallery" className="space-y-4">
            <GalleryManager />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
