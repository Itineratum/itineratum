"use client";

import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import DeleteAccountConfirmationDialog from "../delete-account-confirmation-dialog";
import BreadcrumbNavigator from "./breadcrumb-navigator/breadcrumb-navigator";
import LeftColumn from "./left-column/left-column";
import RightColumn from "./right-column/right-column";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "./styles";
dayjs.extend(utc);

const PersonalInformation = ({}: {}) => {
  const t = useTranslations("account.personalInformation");
  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  const {
    showConfirmDeleteDialog,
    getUserAccountDetails,
    setValue,
    closeConfirmDeleteDialog,
    deleteAccount,
  } = usePersonalInformation();

  useEffect(() => {
    if (getUserAccountDetails.data) {
      const userDetails = getUserAccountDetails.data;

      setValue("firstName", userDetails.firstName);
      setValue("lastName", userDetails.lastName);
      setValue("email", userDetails.email);
      setValue("address1", userDetails.address1);
      setValue("address2", userDetails.address2);

      if (userDetails.dateOfBirth) {
        const utcDate = dayjs(userDetails.dateOfBirth).utc(true);
        setValue("dateOfBirth", utcDate);
      }
    }
  }, [getUserAccountDetails.data]);

  return (
    <Box component="form" noValidate marginY={styles.MARGIN}>
      <BreadcrumbNavigator />
      <Grid container spacing={styles.COLUMN_SPACING}>
        <LeftColumn />
        <RightColumn />
      </Grid>
      <DeleteAccountConfirmationDialog
        open={showConfirmDeleteDialog}
        handleClose={closeConfirmDeleteDialog}
        deleteAccount={deleteAccount}
      />
    </Box>
  );
};

export default PersonalInformation;
