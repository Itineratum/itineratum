"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import { ContinueWithGoogleButton } from "@/components/molecules/continue-with-google-button";
import UserAvatar from "@/components/molecules/user-avatar";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { AuthService } from "@/constants/enums/authService";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AccountPersonalInformationData } from "@/constants/types/accountPersonalInformationData";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

  const columnSpacing: number = 7;
  const topMargin: number = 5;
  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const fieldSpacing: number = 2;
  const columnSx: number = 12 / 2;
  const textFieldSx = {
    "& .MuiInputBase-input": {
      padding: "10px",
    },
  };

  const firstNameId = "firstName";
  const lastNameId = "lastName";
  const emailId = "email";
  const address1Id = "address1";
  const address2Id = "address2";
  const dateOfBirthId = "dateOfBirth";

  const firstName = watch(firstNameId);
  const lastName = watch(lastNameId);
  const email = watch(emailId);
  const address1 = watch(address1Id);
  const address2 = watch(address2Id);
  const dateOfBirth = watch(dateOfBirthId);

  const getUserAccountDetails = trpc.user.getUserAccountDetails.useQuery({
    email: session?.user.email!,
  });
  const deleteUserAccount = trpc.user.deleteUserAccount.useMutation({
    onSuccess: () => {
      // TODO: come out with a better logic to show to the user that they have deleted their account
      window.alert("USER DELETED");
    },
  });
  const updateUserAccount = trpc.user.updateUserAccount.useMutation({
    onSuccess: () => {
      // TODO: come out with a better logic to show to the user that they have updated their account
      window.alert("USER UPDATED");
    },
  });

  useEffect(() => {
    if (getUserAccountDetails.data) {
      const userDetails = getUserAccountDetails.data;

      setValue(firstNameId, userDetails.firstName);
      setValue(lastNameId, userDetails.lastName);
      setValue(emailId, userDetails.email);
      setValue(address1Id, userDetails.address1);
      setValue(address2Id, userDetails.address2);

      if (userDetails.dateOfBirth)
        setValue(dateOfBirthId, new Date(userDetails.dateOfBirth));
    }
  }, [getUserAccountDetails.data]);

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
  const userAvatarField = () => {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <UserAvatar image={image} editable={true} />
      </Box>
    );
  };
  const nameSection = () => {
    const firstNameField = () => {
      return (
        <Box width="100%">
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
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={firstName}
                sx={textFieldSx}
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
        <Box width="100%">
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
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={lastName}
                sx={textFieldSx}
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
              sx={textFieldSx}
              disabled
            />
          )}
        />
      </Box>
    );
  };
  // TODO: should not even have a password field that displays the user's password. both technically impossible and not the best practice. instead, ask users to verify their current password and then change password by typing in a new one
  const changePasswordButton = () => {
    const buttonWidth: string = "50%";

    const handleOnClick = () => {};

    return (
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ my: formMargin, maxWidth: buttonWidth, alignSelf: "center" }}
        color="primary"
        // disabled={isVerifying}
        onClick={handleOnClick}
      >
        <Text
          text={t("changePassword")}
          variant={TypographyVariant.button}
          bold={false}
        />
      </Button>
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
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={address1}
                sx={textFieldSx}
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
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={address2}
                sx={textFieldSx}
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
  const dobField = () => {
    const dateFormat: string = "DD/MM/YYYY";

    return (
      <Box>
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("dob")}
        </InputLabel>
        <Controller
          key={dateOfBirthId}
          name={dateOfBirthId}
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                {...field}
                format={dateFormat}
                sx={{ width: "100%" }}
                value={dateOfBirth}
              />
            </LocalizationProvider>
          )}
        />
      </Box>
    );
  };
  const googleButton = () => {
    const buttonWidth: string = "100%";

    return (
      <Box>
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("google")}
        </InputLabel>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <ContinueWithGoogleButton
            formMargin={formMargin}
            buttonWidth={buttonWidth}
            text={t("connectGoogle")}
          />
        </Box>
      </Box>
    );
  };
  const actionButtons = () => {
    const buttonWidth: string = "50%";

    const saveButton = () => {
      const handleOnClick = async () => {
        const data = {
          firstName,
          lastName,
          email,
          address1,
          address2,
          dateOfBirth,
        };
        await updateUserAccount.mutateAsync(data);
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth, alignSelf: "center" }}
          color="secondary"
          // disabled={isVerifying}
          onClick={handleOnClick}
        >
          <Text
            text={t("saveAccount")}
            variant={TypographyVariant.button}
            bold={false}
          />
        </Button>
      );
    };

    const deleteAccountButton = () => {
      const handleOnClick = async () => {
        const data = { email };
        await deleteUserAccount.mutateAsync(data);
        signOut({ callbackUrl: "/" });
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth, alignSelf: "center" }}
          color="primary"
          // disabled={isVerifying}
          onClick={handleOnClick}
        >
          <Text
            text={t("deleteAccount")}
            variant={TypographyVariant.button}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Stack direction={"row"} spacing={fieldSpacing}>
        {saveButton()}
        {deleteAccountButton()}
      </Stack>
    );
  };

  return (
    <Box component="form" noValidate marginTop={topMargin}>
      {breadcrumbNavigator()}
      <Grid container spacing={columnSpacing}>
        <Grid item xs={columnSx}>
          <Stack spacing={fieldSpacing}>
            {userAvatarField()}
            {nameSection()}
            {emailField()}
            {session?.provider === AuthService.Credentials ? (
              changePasswordButton()
            ) : (
              <></>
            )}
          </Stack>
        </Grid>
        <Grid item xs={columnSx}>
          <Stack spacing={fieldSpacing}>
            {addressSection()}
            {dobField()}
            {session?.provider === AuthService.Google ? <></> : googleButton()}
            {actionButtons()}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountPersonalInformation;
