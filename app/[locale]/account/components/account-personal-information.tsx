"use client";

import Text from "@/components/atoms/text";
import UserAvatar from "@/components/molecules/user-avatar";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AccountPersonalInformationData } from "@/constants/types/accountPersonalInformationData";
import {
  Box,
  Breadcrumbs,
  Button,
  Input,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AccountPersonalInformation = ({
  accountSetting,
  setAccountSetting,
}: {
  accountSetting: AccountSetting;
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>;
}) => {
  const t = useTranslations("account.personalInformation");
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm<AccountPersonalInformationData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<"info" | "error">("info");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const name: string | undefined | null = session?.user?.name;
  const image: string | undefined | null = session?.user?.image;

  const sectionMargin: number = 7;
  const topMargin: number = 5;
  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const fieldSpacing: number = 2;

  const firstNameId = "firstName";
  const lastNameId = "lastName";
  const passwordId = "password";
  const emailId = "email";
  const address1Id = "address1";
  const address2Id = "address2";
  const dobId = "dob";

  const firstName = watch(firstNameId);
  const lastName = watch(lastNameId);
  const password = watch(passwordId);
  const email = watch(emailId);
  const address1 = watch(address1Id);
  const address2 = watch(address2Id);
  const dob = watch(dobId);

  const breadcrumbNavigator = () => {
    const accountOnClickHandler = () => {
      // go back to account base page
      setAccountSetting(AccountSetting.base);
    };

    return (
      <Breadcrumbs separator=" > ">
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
        <Button
          sx={{
            color:
              accountSetting === AccountSetting.personalInformation
                ? colorsConst.breadcrumbNavigator.selected
                : colorsConst.breadcrumbNavigator.unselected,
          }}
        >
          <Text
            text={t("personalInformation")}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Button>
      </Breadcrumbs>
    );
  };
  const nameSection = () => {
    const firstNameField = () => {
      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("firstName")}
          </InputLabel>
          <Controller
            key={firstNameId}
            name={firstNameId}
            control={control}
            defaultValue=""
            rules={{
              required: t("firstNameError"),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={firstName}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
                error={!!errors.firstName}
                helperText={
                  errors.firstName ? (errors.firstName.message as string) : ""
                }
              />
            )}
          />
        </Box>
      );
    };

    const lastNameField = () => {
      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("lastName")}
          </InputLabel>
          <Controller
            key={lastNameId}
            name={lastNameId}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={lastName}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
              />
            )}
          />
        </Box>
      );
    };

    return (
      <Stack direction={"row"} spacing={fieldSpacing}>
        {firstNameField()}
        {lastNameField()}
      </Stack>
    );
  };
  const passwordField = () => {
    return (
      <Box>
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("password")}
        </InputLabel>
        <Controller
          key={passwordId}
          name={passwordId}
          control={control}
          defaultValue=""
          rules={{
            required: t("passwordError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              value={password}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.password}
              helperText={
                errors.password ? (errors.password.message as string) : ""
              }
            />
          )}
        />
      </Box>
    );
  };
  const emailField = () => {
    return (
      <Box>
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("email")}
        </InputLabel>
        <Controller
          key={emailId}
          name={emailId}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              value={email}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              disabled
            />
          )}
        />
      </Box>
    );
  };
  const addressSection = () => {
    const address1Field = () => {
      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("address1")}
          </InputLabel>
          <Controller
            key={address1Id}
            name={address1Id}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={address1}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
              />
            )}
          />
        </Box>
      );
    };

    const address2Field = () => {
      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("address2")}
          </InputLabel>
          <Controller
            key={address2Id}
            name={address2Id}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={address2}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
              />
            )}
          />
        </Box>
      );
    };

    return (
      <Stack spacing={fieldSpacing}>
        {address1Field()}
        {address2Field()}
      </Stack>
    );
  };
  const dobSection = () => {
    const monthField = () => {
      return (
        <Controller
          key={address2Id}
          name={address2Id}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              label={t("dob.month")}
              variant="filled"
              margin={formFieldMargin}
              value={address2}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
            />
          )}
        />
      );
    };

    const dayField = () => {
      return (
        <Controller
          key={address2Id}
          name={address2Id}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              label={t("dob.day")}
              variant="filled"
              margin={formFieldMargin}
              value={address2}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
            />
          )}
        />
      );
    };

    const yearField = () => {
      return (
        <Controller
          key={address2Id}
          name={address2Id}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              label={t("dob.year")}
              variant="filled"
              margin={formFieldMargin}
              value={address2}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
            />
          )}
        />
      );
    };

    return (
      <Box>
        <InputLabel>
          {" "}
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("dob.dob")}
          </InputLabel>
        </InputLabel>
        <Stack direction={"row"} spacing={fieldSpacing}>
          {monthField()}
          {dayField()}
          {yearField()}
        </Stack>
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      marginTop={topMargin}
    >
      <Stack spacing={fieldSpacing}>
        {breadcrumbNavigator()}
        <UserAvatar image={image} editable={true} />
        {nameSection()}
        {passwordField()}
        {emailField()}
        {addressSection()}
        {dobSection()}
      </Stack>
    </Box>
  );
};

export default AccountPersonalInformation;
