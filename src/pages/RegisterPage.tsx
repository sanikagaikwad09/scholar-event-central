
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { AuthForm } from "@/components/AuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RegisterPage = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md animate-fade-in shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="register" />
          </CardContent>
          <CardFooter className="text-center">
            <div className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 hover:text-teal-800 font-medium">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
