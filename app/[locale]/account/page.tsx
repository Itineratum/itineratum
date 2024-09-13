"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import defaultUserImage from "@/public/user_profile.svg";
import { Box, Button, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Account = () => {
  const t = useTranslations("account");
  const { data: session } = useSession();
  const name: string | undefined | null = session?.user?.name;
  const email: string = session?.user?.email!;
  const image: string | undefined | null = session?.user?.image;

  const sectionMargin: number = 10;

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
  const userDetailsSection = () => {
    const spacing: number = 3;

    const userName = () => {
      return name ? (
        <Text text={name} variant={TypographyVariant.h3} bold={false} />
      ) : (
        <></>
      );
    };

    const userEmail = () => {
      return <Text text={email} variant={TypographyVariant.h3} bold={false} />;
    };

    return (
      <Stack spacing={spacing} sx={{ textAlign: "center" }}>
        {userName()}
        {userEmail()}
      </Stack>
    );
  };
  const accountActionsSection = () => {
    const spacing: number = 2;

    const personalInformation = () => {
      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
        >
          <Text
            text={t("personalInformation")}
            variant={TypographyVariant.h3}
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
            variant={TypographyVariant.h3}
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
            variant={TypographyVariant.h3}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Stack spacing={spacing} sx={{ textAlign: "center", marginTop: sectionMargin }}>
        {personalInformation()}
        {accessibility()}
        {notifications()}
      </Stack>
    );
  };
  const legalSection = () => {
    const spacing: number = 2;

    const termsAndConditions = () => {
      return (
        <Button
          sx={{
            color: colorsConst.palette.text.primary,
          }}
        >
          <Text
            text={t("termsAndConditions")}
            variant={TypographyVariant.h3}
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
            variant={TypographyVariant.h3}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Stack spacing={spacing} sx={{ textAlign: "center", marginTop: sectionMargin }}>
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
      {userDetailsSection()}
      {accountActionsSection()}
      {legalSection()}
    </Box>
  );
};

export default Account;
