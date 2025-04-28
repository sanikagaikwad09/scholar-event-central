
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminLoginPage = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is logged in and is an admin, redirect to admin dashboard
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, navigate]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
        <Card className="w-full max-w-md animate-fade-in shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="login" isAdminLogin={true} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Return to{" "}
              <Link to="/login" className="text-teal-600 hover:text-teal-800 font-medium">
                Regular Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminLoginPage;
