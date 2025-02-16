"use client";

import Text from "@/components/atoms/text";
import UserAvatar from "@/components/molecules/user-avatar";
import { AccountSetting } from "@/constants/enums/accountSetting";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import urlsConst from "@/constants/urls.json";
import { Box, Button, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

const AccountBase = ({
  setAccountSetting,
}: {
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>;
}) => {
  const t = useTranslations("account");
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const name: string | undefined | null = session?.user?.name;
  const router = useRouter();

  const sectionMargin: number = 7;
  const headerTypographyVariant = TypographyVariant.h4;
  const buttonTypographyVariant = TypographyVariant.h6;

  useEffect(() => {
    if (!isLoggedIn) router.push("/protected");
  }, [status, router]);

  const userName = () => {
    return name ? (
      <Text text={name} variant={TypographyVariant.h4} bold={false} />
    ) : (
      <></>
    );
  };
  const settingsSection = () => {
    const spacing: number = 2;

    const header = () => {
      return (
        <Text
          text={t("settings")}
          variant={headerTypographyVariant}
          bold={false}
          textDecoration={TypographyTextDecoration.underline}
        />
      );
    };

    const personalInformation = () => {
      const handleOnClick = () => {
        setAccountSetting(AccountSetting.personalInformation);
      };

      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
          onClick={handleOnClick}
        >
          <Text
            text={t("personalInformation.personalInformation")}
            variant={buttonTypographyVariant}
            bold={false}
          />
        </Button>
      );
    };

    const accessibility = () => {
      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
        >
          <Text
            text={t("accessibility")}
            variant={buttonTypographyVariant}
            bold={false}
          />
        </Button>
      );
    };

    const notifications = () => {
      const handleOnClick = () => {
        setAccountSetting(AccountSetting.notifications);
      };

      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
          onClick={handleOnClick}
        >
          <Text
            text={t("notifications.notifications")}
            variant={buttonTypographyVariant}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Stack
        spacing={spacing}
        sx={{ textAlign: "center", marginTop: sectionMargin }}
      >
        {header()}
        {personalInformation()}
        {accessibility()}
        {notifications()}
      </Stack>
    );
  };
  const legalSection = () => {
    const spacing: number = 2;

    const header = () => {
      return (
        <Text
          text={t("legal")}
          variant={headerTypographyVariant}
          bold={false}
          textDecoration={TypographyTextDecoration.underline}
        />
      );
    };

    const termsAndConditions = () => {
      const handleOnClick = () => {
        router.replace(endpointsConst.termsAndConditions.endpoint);
      };

      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
            textDecoration: "none",
          }}
          onClick={handleOnClick}
        >
          <Text
            text={t("termsAndConditions")}
            variant={buttonTypographyVariant}
            bold={false}
          />
        </Button>
      );
    };

    const privacyPolicy = () => {
      const handleOnClick = () => {
        router.replace(urlsConst.privacyPolicy);
      };

      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
          onClick={handleOnClick}
        >
          <Text
            text={t("privacyPolicy")}
            variant={buttonTypographyVariant}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Stack
        spacing={spacing}
        sx={{ textAlign: "center", marginTop: sectionMargin }}
      >
        {header()}
        {termsAndConditions()}
        {privacyPolicy()}
      </Stack>
    );
  };

  return status === "loading" || !isLoggedIn ? null : (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <UserAvatar editable={false} />
      {userName()}
      {settingsSection()}
      {legalSection()}
    </Box>
  );
};

export default AccountBase;
