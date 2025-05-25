
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthFormProps {
  type: "login" | "register";
  isAdminLogin?: boolean;
}

export function AuthForm({ type, isAdminLogin = false }: AuthFormProps) {
  if (type === "login") {
    return <LoginForm isAdminLogin={isAdminLogin} />;
  }
  return <RegisterForm />;
}
