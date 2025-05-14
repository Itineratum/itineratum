import SignUpPage from "@/components/templates/sign-up-page";
import { SignupProvider } from "@/contexts/signupContext";

const SignUp = () => {
  return (
    <SignupProvider>
      <SignUpPage />
    </SignupProvider>
  );
};

export default SignUp;
