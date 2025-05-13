"use client";

import Base from "@/app/[locale]/account/components/base/base";
import AccountNotifications from "@/app/[locale]/account/components/notifications/account-notifications";
import PersonalInformation from "@/app/[locale]/account/components/personal-information/personal-information";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { NotificationsProvider } from "@/contexts/notificationsContext";
import { PersonalInformationProvider } from "@/contexts/personalInformationContext";
import { useAccount } from "@/hooks/useAccount";
import { Slide } from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useRef, useState } from "react";

const AccountPage = () => {
  const { accountSetting } = useAccount();
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
      {/* base  */}
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
      <PersonalInformationProvider>
        {/* personal information */}
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
      </PersonalInformationProvider>
      <NotificationsProvider>
        {/* notifications */}
        <Slide
          direction="left"
          in={accountSetting === AccountSetting.notifications}
          timeout={pageTransitionDuration}
          mountOnEnter
          unmountOnExit
          style={{ position: "relative", width: "100%" }}
        >
          <Container key={AccountSetting.notifications} ref={notificationsRef}>
            <AccountNotifications />
          </Container>
        </Slide>
      </NotificationsProvider>
    </Container>
  );
};

export default AccountPage;
