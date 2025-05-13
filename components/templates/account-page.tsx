"use client";

import AccountNotifications from "@/app/[locale]/account/components/account-notifications";
import Base from "@/app/[locale]/account/components/base/base";
import PersonalInformation from "@/app/[locale]/account/components/personal-information/personal-information";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { PersonalInformationProvider } from "@/contexts/personalInformationContext";
import { useAccount } from "@/hooks/useAccount";
import { Slide } from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useRef, useState } from "react";

const AccountPage = () => {
  const { accountSetting, setAccountSetting } = useAccount();
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const baseRef = useRef<HTMLDivElement>(null);
  const personalInfoRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const pageTransitionDuration: number = 500;

  useEffect(() => {
    const activeRef =
      accountSetting === AccountSetting.base
        ? baseRef
        : accountSetting === AccountSetting.personalInformation
          ? personalInfoRef
          : notificationsRef;

    if (!activeRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        requestAnimationFrame(() => {
          const newHeight = `${entry.contentRect.height}px`;

          if (newHeight !== containerHeight) setContainerHeight(newHeight);
        });
      }
    });

    resizeObserver.observe(activeRef.current);
    return () => resizeObserver.disconnect();
  }, [accountSetting, containerHeight]);

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
        <Container key={AccountSetting.base} ref={baseRef}>
          <Base />
        </Container>
      </Slide>
    );
  };

  const personalInformation = () => {
    return (
      <Slide
        direction="left"
        in={accountSetting === AccountSetting.personalInformation}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
        style={{ position: "relative", width: "100%" }}
      >
        <Container
          key={AccountSetting.personalInformation}
          ref={personalInfoRef}
        >
          <PersonalInformation />
        </Container>
      </Slide>
    );
  };

  const notifications = () => {
    return (
      <Slide
        direction="left"
        in={accountSetting === AccountSetting.notifications}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
        style={{ position: "relative", width: "100%" }}
      >
        <Container key={AccountSetting.notifications} ref={notificationsRef}>
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        height: containerHeight,
        transition: `height ${pageTransitionDuration}ms ease-in-out`,
      }}
    >
      {base()}
      <PersonalInformationProvider>
        {personalInformation()}
      </PersonalInformationProvider>
      {notifications()}
    </Container>
  );
};

export default AccountPage;
