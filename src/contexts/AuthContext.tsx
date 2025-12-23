
// import { createContext, useContext, useEffect, useState } from 'react';
// import { Session, User } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';

// interface AuthContextType {
//   session: Session | null;
//   user: User | null;
//   isLoading: boolean;
//   isAdmin: boolean;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     // Set up auth state listener FIRST
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         console.log("Auth state change:", event, session?.user?.email);
//         setSession(session);
//         setUser(session?.user ?? null);
        
//         // Check if user is admin
//         if (session?.user) {
//           checkUserRole(session.user.id);
//         } else {
//           setIsAdmin(false);
//         }
//         setIsLoading(false);
//       }
//     );

//     // THEN check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       console.log("Initial session check:", session?.user?.email);
//       setSession(session);
//       setUser(session?.user ?? null);
      
//       // Check if user is admin
//       if (session?.user) {
//         checkUserRole(session.user.id);
//       }
//       setIsLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const checkUserRole = async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', userId)
//         .single();
      
//       if (error) {
//         console.error("Error checking user role:", error);
//         setIsAdmin(false);
//         return;
//       }
      
//       // Check if the user has the admin role
//       const userIsAdmin = data?.role === 'admin';
//       setIsAdmin(userIsAdmin);
//       console.log("User role check:", data?.role, "isAdmin:", userIsAdmin);
//     } catch (error) {
//       console.error("Error checking user role:", error);
//       setIsAdmin(false);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setSession(null);
//       setUser(null);
//       setIsAdmin(false);
//       navigate('/');
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ session, user, isLoading, isAdmin, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserRole = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    // Simplified admin check by email
    setIsAdmin(user.email === "admin@aimsr.edu.in");
  };

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session: supaSession },
      } = await supabase.auth.getSession();

      const currentUser = supaSession?.user ?? null;  // <-- Fix here
      setSession(supaSession);
      setUser(currentUser);

      console.log("AuthContext user:", currentUser);

      await checkUserRole(currentUser);
      setIsLoading(false);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);

        console.log("AuthContext user (onAuthStateChange):", currentUser);

        await checkUserRole(currentUser);
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAdmin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
