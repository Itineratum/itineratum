"use client";

import { AccountSetting } from "@/constants/enums/accountSetting";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type AccountContextType = {
  session: Session | null;
  isLoggedIn: boolean;
  name: string | undefined | null;
  router: AppRouterInstance;
  accountSetting: AccountSetting;
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>;
  update: any;
};

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status, update } = useSession();
  const isLoggedIn = status === "authenticated";
  const name = session?.user?.name;
  const router = useRouter();

  const [accountSetting, setAccountSetting] = useState<AccountSetting>(
    AccountSetting.base
  );

  return (
    <AccountContext.Provider
      value={{
        session,
        isLoggedIn,
        name,
        router,
        accountSetting,
        setAccountSetting,
        update,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
