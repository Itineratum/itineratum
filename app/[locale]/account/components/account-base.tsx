"use client";

import Text from "@/components/atoms/text";
import { AccountSetting } from "@/constants/enums/accountSetting";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import defaultUserImage from "@/public/user_profile.svg";
import { Box, Button, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

const AccountBase = ({
  setAccountSetting
}: {
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>
}) => {
  const t = useTranslations("account");
  const { data: session } = useSession();
  const name: string | undefined | null = session?.user?.name;
  const image: string | undefined | null = session?.user?.image;

  const sectionMargin: number = 7;

  const userAvatar = () => {
    const imageSize: number = 200;
    const topMargin: number = 40;
    const bottomMargin = topMargin;

    return (
      <Image
        src={image ? image : defaultUserImage}
        width={imageSize}
        height={imageSize}
        alt="User Profile Picture"
        style={{
          objectFit: "cover",
          borderRadius: imageSize / 2,
          marginTop: topMargin,
          marginBottom: bottomMargin,
        }}
      />
    );
  };
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
          variant={TypographyVariant.h4}
          bold={false}
          textDecoration={TypographyTextDecoration.underline}
        />
      );
    };

    const personalInformation = () => {
      const handleOnClick = () => {
        setAccountSetting(AccountSetting.personalInformation);
      }

      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
          onClick={handleOnClick}
        >
          <Text
            text={t("personalInformation")}
            variant={TypographyVariant.h5}
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
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Button>
      );
    };

    const notifications = () => {
      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
        >
          <Text
            text={t("notifications")}
            variant={TypographyVariant.h5}
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
          variant={TypographyVariant.h4}
          bold={false}
          textDecoration={TypographyTextDecoration.underline}
        />
      );
    };

    const termsAndConditions = () => {
      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
        >
          <Text
            text={t("termsAndConditions")}
            variant={TypographyVariant.h5}
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
            text={t("privacyPolicy")}
            variant={TypographyVariant.h5}
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
        {accessibility()}
      </Stack>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {userAvatar()}
      {userName()}
      {settingsSection()}
      {legalSection()}
    </Box>
  );
};

export default AccountBase;
