
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";

interface AuthFormProps {
  type: "login" | "register";
  isAdminLogin?: boolean;
}

// This refactored AuthForm is slim and only delegates to LoginForm/RegisterForm.
export function AuthForm({ type, isAdminLogin = false }: AuthFormProps) {
  if (type === "login") {
    return <LoginForm isAdminLogin={isAdminLogin} />;
  }
  return <RegisterForm />;
}
