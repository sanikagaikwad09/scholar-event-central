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

  // HELPER: Cleans up all supabase auth keys
  // Always call before login/signup
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) localStorage.removeItem(key);
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) sessionStorage.removeItem(key);
    });
  };

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setIsLoading(true);
    try {
      if (type === 'login') {
        // SPECIAL ADMIN LOGIN FLOW (bypass email verification if needed)
        if (isAdminLogin && data.email === 'admin@aimsr.edu.in') {
          cleanupAuthState();
          try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
          if (signInError) {
            if (
              signInError.message === "Email not confirmed" ||
              signInError.status === 400 ||
              signInError.code === "email_not_confirmed"
            ) {
              toast({ title: "Admin email not verified", description: "Please complete verification from your email." });
            } else {
              throw signInError;
            }
          } else {
            // Check admin role in profiles
            const { data: profile, error: pError } = await supabase
              .from('profiles').select('role').eq('id', signInData.user.id).maybeSingle();
            if (profile?.role === 'admin') {
              toast({ title: "Admin login successful!" });
              window.location.href = "/admin/dashboard"; // Use full reload for session consistency
              return;
            } else {
              throw new Error("Access denied. Admin privileges required.");
            }
          }
        } else {
          // REGULAR LOGIN
          cleanupAuthState();
          try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
          const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

          if (error) {
            if (error.message === "Email not confirmed") {
              await supabase.auth.resend({ type: 'signup', email: data.email });
              toast({ 
                title: "Email verification required", 
                description: "We've sent you a verification email. Please check your inbox."
              });
            } else {
              throw error;
            }
          } else {
            toast({ title: "Login successful!" });
            window.location.href = "/"; // Use full reload for session consistency
            return;
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
