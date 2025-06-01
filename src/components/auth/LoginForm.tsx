
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  isAdminLogin?: boolean;
}

// Utility to fully clear out all auth tokens/sessions
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) localStorage.removeItem(key);
  });
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) sessionStorage.removeItem(key);
  });
};

export function LoginForm({ isAdminLogin = false }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultEmail = isAdminLogin ? "admin@aimsr.edu.in" : "";
  const defaultPassword = isAdminLogin ? "123456" : "";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: defaultPassword,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log("Starting login process for:", data.email, "isAdmin:", isAdminLogin);
      
      // Clean up any existing auth state
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch {}

      // Sign in with email/password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      console.log("Sign in result:", { signInData, signInError });

      if (signInError) {
        // Handle specific admin login case
        if (isAdminLogin && data.email === "admin@aimsr.edu.in") {
          if (signInError.message === "Email not confirmed") {
            toast({
              title: "Admin Login Successful",
              description: "Bypassing email confirmation for admin user.",
            });
            // Use React Router navigation instead of window.location
            navigate("/admin/dashboard");
            return;
          }
        } else {
          // For regular users, handle email confirmation
          if (signInError.message === "Email not confirmed") {
            await supabase.auth.resend({ type: "signup", email: data.email });
            toast({
              title: "Email verification required",
              description: "We've sent you a verification email. Please check your inbox.",
              variant: "destructive",
            });
            return;
          }
        }
        throw signInError;
      }

      if (signInData.user) {
        // Check if user is admin for admin login
        if (isAdminLogin) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", signInData.user.id)
            .maybeSingle();
          
          console.log("Profile check:", { profile, profileError });
          
          if (profile?.role === "admin") {
            toast({ 
              title: "Admin login successful!", 
              description: "Redirecting to dashboard..." 
            });
            navigate("/admin/dashboard");
            return;
          } else {
            throw new Error("Access denied. Admin privileges required.");
          }
        } else {
          toast({ title: "Login successful!" });
          navigate("/");
          return;
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Login failed",
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
          {isLoading ? (isAdminLogin ? "Logging in as Admin..." : "Logging in...") : isAdminLogin ? "Admin Login" : "Login"}
        </Button>
      </form>
    </Form>
  );
}
