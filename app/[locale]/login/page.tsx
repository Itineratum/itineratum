import LoginPage from "@/components/templates/login-page";
import { LoginProvider } from "@/contexts/loginContext";

const Login = () => {
  return (
    <LoginProvider>
      <LoginPage />
    </LoginProvider>
  );
};

export default Login;
