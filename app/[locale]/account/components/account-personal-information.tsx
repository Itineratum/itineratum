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

const AccountPersonalInformation = ({
  setAccountSetting
}: {
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>
}) => {
  const t = useTranslations("account");
  const { data: session } = useSession();
  const name: string | undefined | null = session?.user?.name;
  const image: string | undefined | null = session?.user?.image;

  const sectionMargin: number = 7;

  const navigation = () => {
    
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      PERSONAL INFORMATION
    </Box>
  );
};

export default AccountPersonalInformation;
