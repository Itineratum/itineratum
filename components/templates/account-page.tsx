"use client";

import AccountBase from "@/app/[locale]/account/components/account-base";
import AccountNotifications from "@/app/[locale]/account/components/account-notifications";
import AccountPersonalInformation from "@/app/[locale]/account/components/account-personal-information";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { Slide } from "@mui/material";
import Container from "@mui/material/Container";
import { useTranslations } from "next-intl";
import { useState } from "react";

const AccountPage = () => {
  const t = useTranslations("account");
  const [accountSetting, setAccountSetting] = useState<AccountSetting>(
    AccountSetting.base,
  );

  const pageTransitionDuration: number = 500;

  const base = () => {
    return (
      <Slide
        direction="right"
        appear={false}
        in={accountSetting === AccountSetting.base}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
        style={{ position: "absolute", width: "100%" }}
      >
        <Container key={AccountSetting.base}>
          <AccountBase setAccountSetting={setAccountSetting} />
        </Container>
      </Slide>
    );
  };

  const personalInformation = () => {
    return (
      <Slide
        direction={"left"}
        in={accountSetting === AccountSetting.personalInformation}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
        style={{ position: "absolute", width: "100%" }}
      >
        <Container key={AccountSetting.personalInformation}>
          <AccountPersonalInformation
            accountSetting={accountSetting}
            setAccountSetting={setAccountSetting}
          />
        </Container>
      </Slide>
    );
  };

  const notifications = () => {
    return (
      <Slide
        direction={"left"}
        in={accountSetting === AccountSetting.notifications}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
        style={{ position: "absolute", width: "100%" }}
      >
        <Container key={AccountSetting.notifications}>
          <AccountNotifications
            accountSetting={accountSetting}
            setAccountSetting={setAccountSetting}
          />
        </Container>
      </Slide>
    );
  };

  return (
    <Container
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      {base()}
      {personalInformation()}
      {notifications()}
    </Container>
  );
};

export default AccountPage;
