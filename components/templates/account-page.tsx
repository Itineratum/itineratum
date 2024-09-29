"use client";

import AccountBase from "@/app/[locale]/account/components/account-base";
import AccountPersonalInformation from "@/app/[locale]/account/components/account-personal-information";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { Slide } from "@mui/material";
import Container from "@mui/material/Container";
import { useTranslations } from "next-intl";
import { useState } from "react";

const LoginPage = () => {
  const t = useTranslations("account");
  const [accountSetting, setAccountSetting] = useState<AccountSetting>(
    AccountSetting.base,
  );

  const pageTransitionDuration: number = 500;

  return (
    <Container
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Slide
        direction="right"
        appear={false}
        in={accountSetting === AccountSetting.base}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
        style={{ position: "absolute", width: "100%" }}
      >
        <div key={AccountSetting.base}>
          <AccountBase setAccountSetting={setAccountSetting} />
        </div>
      </Slide>
      <Slide
        direction={"left"}
        in={accountSetting === AccountSetting.personalInformation}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
        style={{ position: "absolute", width: "100%" }}
      >
        <div key={AccountSetting.personalInformation}>
          <AccountPersonalInformation
            accountSetting={accountSetting}
            setAccountSetting={setAccountSetting}
          />
        </div>
      </Slide>
    </Container>
  );
};

export default LoginPage;
