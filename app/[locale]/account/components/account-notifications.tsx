"use client";

import Text from "@/components/atoms/text";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AccountPersonalInformationFormData } from "@/constants/types/accountPersonalInformationData";
import {
  Box,
  Breadcrumbs,
  Button
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
dayjs.extend(utc);

const AccountNotifications = ({
  accountSetting,
  setAccountSetting,
}: {
  accountSetting: AccountSetting;
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>;
}) => {
  const t = useTranslations("account.notifications");
  const { data: session, update } = useSession();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AccountPersonalInformationFormData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showConfirmDeleteDialog, setShowConformDeleteDialog] =
    useState<boolean>(false);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);

  const columnSpacing: number = 7;
  const margin: number = 5;
  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const fieldSpacing: number = 2;
  const columnSx: number = 12 / 2;
  const textFieldSx = {
    "& .MuiInputBase-input": {
      padding: "10px",
    },
  };

  const breadcrumbNavigator = () => {
    const accountButton = () => {
      const accountOnClickHandler = () => {
        // go back to account base page
        setAccountSetting(AccountSetting.base);
      };

      return (
        <Button
          sx={{
            color:
              accountSetting === AccountSetting.base
                ? colorsConst.breadcrumbNavigator.selected
                : colorsConst.breadcrumbNavigator.unselected,
          }}
          onClick={accountOnClickHandler}
        >
          <Text
            text={t("account")}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Button>
      );
    };
    const personalInformationButton = () => {
      return (
        <Button
          sx={{
            color:
              accountSetting === AccountSetting.notifications
                ? colorsConst.breadcrumbNavigator.selected
                : colorsConst.breadcrumbNavigator.unselected,
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
      <Breadcrumbs separator=" > ">
        {accountButton()}
        {personalInformationButton()}
      </Breadcrumbs>
    );
  };

  return (
    <Box component="form" noValidate marginY={margin}>
      {breadcrumbNavigator()}
    </Box>
  );
};

export default AccountNotifications;
