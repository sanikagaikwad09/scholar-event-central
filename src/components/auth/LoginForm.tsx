
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  const { isAdmin } = useAuth();

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
      // ADMIN LOGIN PATH: bypass email verification, force dashboard on success
      if (isAdminLogin && data.email === "admin@aimsr.edu.in" && data.password === "123456") {
        cleanupAuthState();
        try {
          await supabase.auth.signOut({ scope: "global" });
        } catch {}
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (signInError) {
          throw signInError;
        }
        // Skip email confirmation check, force profile role check
        const { data: profile, error: pError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", signInData.user.id)
          .maybeSingle();
        if (profile?.role === "admin") {
          toast({ title: "Admin login successful!", description: "Redirecting to dashboard..." });
          window.location.href = "/admin/dashboard";
          return;
        } else {
          throw new Error("Access denied. Admin privileges required.");
        }
      } else {
        // NORMAL login: require email confirmation (unless admin)
        cleanupAuthState();
        try { await supabase.auth.signOut({ scope: "global" }); } catch {}
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) {
          // Only require email confirmation for non-admins
          if (error.message === "Email not confirmed") {
            await supabase.auth.resend({ type: "signup", email: data.email });
            toast({
              title: "Email verification required",
              description: "We've sent you a verification email. Please check your inbox.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({ title: "Login successful!" });
          window.location.href = "/";
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
        {/* Email input */}
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
        {/* Password input */}
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
