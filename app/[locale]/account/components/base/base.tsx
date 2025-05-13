"use client";

import UserAvatar from "@/components/molecules/user-avatar";
import { useAccount } from "@/hooks/useAccount";
import { Box } from "@mui/material";
import { useEffect } from "react";
import LegalSection from "./legal-section/legal-section";
import SettingsSection from "./settings-section/settings-section";
import UserName from "./user-name";

const Base = () => {
  const { isLoggedIn, router } = useAccount();

  useEffect(() => {
    if (!isLoggedIn) router.push("/protected");
  }, [status, router]);

  return status === "loading" || !isLoggedIn ? null : (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <UserAvatar editable={false} />
      <UserName />
      <SettingsSection />
      <LegalSection />
    </Box>
  );
};

export default Base;
