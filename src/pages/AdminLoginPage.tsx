
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import MainLayout from "@/components/MainLayout";
// import { AuthForm } from "@/components/AuthForm";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";

// const AdminLoginPage = () => {
//   const { user, isAdmin, isLoading } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [isRedirecting, setIsRedirecting] = useState(false);
  
//   useEffect(() => {
//     // If user is logged in and is an admin, redirect to admin dashboard
//     if (user && isAdmin && !isRedirecting) {
//       setIsRedirecting(true);
//       toast({ 
//         title: "Admin login successful",
//         description: "Redirecting to admin dashboard..."
//       });
//       // Use a small delay to ensure the toast is shown before redirect
//       setTimeout(() => {
//         navigate('/admin/dashboard', { replace: true });
//       }, 1000);
//     }
//   }, [user, isAdmin, navigate, toast, isRedirecting]);

//   // Don't show the login form if user is already an admin
//   if (user && isAdmin) {
//     return (
//       <MainLayout>
//         <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
//           <Card className="w-full max-w-md">
//             <CardContent className="pt-6">
//               <div className="text-center">
//                 <p>Redirecting to admin dashboard...</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
//         <Card className="w-full max-w-md animate-fade-in shadow-lg">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
//             <CardDescription className="text-center">
//               Enter your admin credentials to access the dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <AuthForm type="login" isAdminLogin={true} />
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <div className="text-center text-sm">
//               Return to{" "}
//               <Link to="/login" className="text-teal-600 hover:text-teal-800 font-medium">
//                 Regular Login
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </MainLayout>
//   );
// };

// export default AdminLoginPage;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";  // <-- Import useAuth
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminLoginPage = () => {
  const { user, isLoading, isAdmin } = useAuth();  // <-- Get user, isLoading, isAdmin from context
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && user && isAdmin && !isRedirecting) {
      setIsRedirecting(true);
      toast({
        title: "Admin login successful",
        description: "Redirecting to admin dashboard...",
      });
      setTimeout(() => navigate("/admin/dashboard", { replace: true }), 1000);
    }
  }, [user, isAdmin, isLoading, isRedirecting, toast, navigate]);

  if (user && isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p>Redirecting to admin dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

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
