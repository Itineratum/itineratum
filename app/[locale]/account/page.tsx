import AccountPage from "@/components/templates/account-page";
import { AccountProvider } from "@/contexts/accountContext";

const Account = () => {
  return (
    <AccountProvider>
      <AccountPage />
    </AccountProvider>
  );
};

export default Account;
