
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(['student', 'organizer', 'admin']),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: 'login' | 'register';
  isAdminLogin?: boolean;
}

export function AuthForm({ type, isAdminLogin = false }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Set default values for the admin login
  const defaultEmail = isAdminLogin ? 'admin@aimsr.edu.in' : '';
  const defaultPassword = isAdminLogin ? '123456' : '';

  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema),
    defaultValues: type === 'login' ? {
      email: defaultEmail,
      password: defaultPassword,
    } : {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'student',
    },
  });

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setIsLoading(true);
    try {
      if (type === 'login') {
        // Special case for admin login
        if (isAdminLogin && data.email === 'admin@aimsr.edu.in') {
          console.log("Attempting admin login...");
          await handleAdminLogin(data as LoginFormValues);
        } else {
          // Regular login
          const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

          if (error) {
            if (error.message === "Email not confirmed") {
              await supabase.auth.resend({
                type: 'signup',
                email: data.email,
              });
              
              toast({ 
                title: "Email verification required", 
                description: "We've sent you a verification email. Please check your inbox to confirm your email and try again.",
                variant: "default"
              });
            } else {
              throw error;
            }
          } else {
            toast({ title: "Login successful!" });
            navigate('/');
          }
        }
      } else {
        // Registration process
        const registerData = data as RegisterFormValues;
        
        // Special handling for admin account creation
        if (registerData.email === 'admin@aimsr.edu.in') {
          const { error } = await supabase.auth.signUp({
            email: registerData.email,
            password: registerData.password,
            options: {
              data: {
                first_name: registerData.firstName,
                last_name: registerData.lastName,
                role: 'admin', // Force role to admin for this special email
              }
            }
          });
          
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signUp({
            email: registerData.email,
            password: registerData.password,
            options: {
              data: {
                first_name: registerData.firstName,
                last_name: registerData.lastName,
                role: registerData.role,
              }
            }
          });
          
          if (error) throw error;
        }
        
        toast({ 
          title: "Registration successful!", 
          description: "You can now log in with your credentials." 
        });
        navigate('/login');
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: type === 'login' ? "Login failed" : "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Special handler for admin login to bypass email verification
  const handleAdminLogin = async (data: LoginFormValues) => {
    try {
      console.log("Handling admin login...");
      
      // First try normal sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (!signInError) {
        console.log("Admin sign in successful via normal flow");
        
        // Check if the user is actually an admin
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user?.id)
          .single();
        
        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw new Error("Could not verify admin status");
        }
        
        if (profileData?.role === 'admin') {
          toast({ title: "Admin login successful!" });
          navigate('/admin/dashboard');
          return;
        } else {
          throw new Error("Access denied. Admin privileges required.");
        }
      }
      
      // If email not confirmed or other error, try to create admin account
      if (signInError) {
        console.log("Admin sign in error:", signInError);
        
        if (signInError.message === "Email not confirmed") {
          console.log("Email not confirmed, trying to create admin user");
          
          // Try to create admin user
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin',
              }
            }
          });
          
          if (signUpError) {
            console.error("Admin signup error:", signUpError);
            throw signUpError;
          }
          
          // After signup, try to sign in directly
          const { data: adminSignIn, error: adminSignInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
          
          if (adminSignInError) {
            console.error("Admin sign in after signup error:", adminSignInError);
            throw adminSignInError;
          }
          
          toast({ title: "Admin account created and logged in!" });
          navigate('/admin/dashboard');
          return;
        } else {
          throw signInError;
        }
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Admin login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {type === 'register' && (
          <>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="organizer">Event Organizer</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? `${type === 'login' ? 'Logging in' : 'Registering'}...` : 
            type === 'login' ? (isAdminLogin ? 'Admin Login' : 'Login') : 'Register'}
        </Button>
      </form>
    </Form>
  );
}
