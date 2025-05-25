import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsList } from "@/components/admin/EventsList";
import { EventForm } from "@/components/admin/EventForm";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events-list");
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
      navigate('/');
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
        <Tabs defaultValue="events-list" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="events-list">Events List</TabsTrigger>
              <TabsTrigger value="add-event">Add Event</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="events-list" className="space-y-4">
            <EventsList onEditEvent={() => setActiveTab("add-event")} />
          </TabsContent>
          <TabsContent value="add-event">
            <EventForm onSuccess={() => setActiveTab("events-list")} />
          </TabsContent>
        </Tabs>
        <div className="mt-10 text-gray-700">
          <strong>Dashboard Roadmap:</strong>
          <ul className="list-disc pl-6">
            <li>Upcoming: Registered students list</li>
            <li>Upcoming: Students who registered for events</li>
            <li>Upcoming: Gallery management</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
