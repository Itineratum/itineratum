"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import {
  AccountNotificationsField,
  AccountNotificationsFieldType,
} from "@/constants/enums/accountNotifications";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Box, Breadcrumbs, Button, Stack, Switch } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const AccountNotifications = ({
  accountSetting,
  setAccountSetting,
}: {
  accountSetting: AccountSetting;
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>;
}) => {
  const t = useTranslations("account.notifications");
  const { data: session } = useSession();
  const router = useRouter();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [newsletterEmail, setNewsletterEmail] = useState<boolean>(false);
  const [newsletterPushNotifications, setNewsletterPushNotifications] =
    useState<boolean>(false);
  const [allOffersUpdatesEmail, setAllOffersUpdatesEmail] =
    useState<boolean>(false);
  const [
    allOffersUpdatesPushNotifications,
    setAllOffersUpdatesPushNotifications,
  ] = useState<boolean>(false);

  const margin: number = 5;
  const formMargin: number = 7;
  const fieldSpacing: number = 4;
  const fieldWidth: string = "27%";

  const getUserAccountNotificationsSettings =
    trpc.user.getUserNotificationsSettings.useQuery(
      {
        email: session?.user.email!,
      },
      {
        onError: (error) => {
          if (error.message === "UNAUTHORIZED") router.push("/protected");
        },
      },
    );
  const updateUserNotificationsSetting =
    trpc.user.updateUserNotificationsSettings.useMutation({
      onSuccess: () => {
        setAlertType(AlertType.success);
        setAlertText(t("notificationsUpdated"));
        setShowAlert(true);
      },
      onError: (error) => {
        if (error.message === "UNAUTHORIZED") router.push("/protected");
      },
    });

  useEffect(() => {
    if (getUserAccountNotificationsSettings.data) {
      const notificationsSettings = getUserAccountNotificationsSettings.data;
      setNewsletterEmail(notificationsSettings.newsletter.email);
      setNewsletterPushNotifications(
        notificationsSettings.newsletter.pushNotifications,
      );
      setAllOffersUpdatesEmail(notificationsSettings.allOffersUpdates.email);
      setAllOffersUpdatesPushNotifications(
        notificationsSettings.allOffersUpdates.pushNotifications,
      );
    }
  }, [getUserAccountNotificationsSettings.data]);

  const NotificationsSwitch = ({
    field,
    fieldType,
    value,
  }: {
    field: AccountNotificationsField;
    fieldType: AccountNotificationsFieldType;
    value: boolean;
  }) => {
    const [checked, setChecked] = useState<boolean>(value);

    const handleOnChange = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const newValue = event.target.checked;
      setChecked(newValue);

      // add a timeout so that the animation can be played before the state changes and trpc call kicks in
      setTimeout(async () => {
        if (field === AccountNotificationsField.newsletter) {
          if (fieldType === AccountNotificationsFieldType.email) {
            setNewsletterEmail(newValue);
          } else {
            setNewsletterPushNotifications(newValue);
          }
        } else {
          if (fieldType === AccountNotificationsFieldType.email) {
            setAllOffersUpdatesEmail(newValue);
          } else {
            setAllOffersUpdatesPushNotifications(newValue);
          }
        }

        const data = {
          email: session?.user.email!,
          field,
          fieldType,
          value: newValue,
        };

        try {
          await updateUserNotificationsSetting.mutateAsync(data);
        } catch (error) {
          if (error instanceof TRPCClientError) {
            setAlertType(AlertType.error);
            setAlertText(t("notificationsUpdateError"));
            setShowAlert(true);
          }
        }
      }, 100);
    };

    return <Switch onChange={handleOnChange} checked={checked} />;
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
    const notificationsButton = () => {
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
        {notificationsButton()}
      </Breadcrumbs>
    );
  };
  const status = (isEnabled: boolean) => {
    return (
      <Text
        text={isEnabled ? t("on") : t("off")}
        variant={TypographyVariant.subtitle1}
        bold={false}
        color="grey"
      />
    );
  };
  const travelTipsAndOffersSection = () => {
    const field = AccountNotificationsField.newsletter;

    const header = () => {
      return (
        <Text
          text={t("travelTipsAndOffers")}
          variant={TypographyVariant.h5}
          bold={true}
        />
      );
    };

    const newsletter = () => {
      return (
        <Text
          text={t("newsletter")}
          variant={TypographyVariant.h6}
          bold={true}
        />
      );
    };

    const emailField = () => {
      const fieldType = AccountNotificationsFieldType.email;

      const emailLabel = () => {
        const label = () => {
          return (
            <Text
              text={t("email")}
              variant={TypographyVariant.h6}
              bold={false}
            />
          );
        };

        return (
          <Stack>
            {label()}
            {status(newsletterEmail)}
          </Stack>
        );
      };

      return (
        <Stack
          direction={"row"}
          justifyContent="space-between"
          width={fieldWidth}
        >
          {emailLabel()}
          <NotificationsSwitch
            field={field}
            fieldType={fieldType}
            value={newsletterEmail}
          />
        </Stack>
      );
    };

    const pushNotificationsField = () => {
      const fieldType = AccountNotificationsFieldType.pushNotifications;

      const pushNotificationsLabel = () => {
        const label = () => {
          return (
            <Text
              text={t("pushNotifications")}
              variant={TypographyVariant.h6}
              bold={false}
            />
          );
        };

        return (
          <Stack>
            {label()}
            {status(newsletterPushNotifications)}
          </Stack>
        );
      };

      return (
        <Stack
          direction={"row"}
          justifyContent="space-between"
          width={fieldWidth}
        >
          {pushNotificationsLabel()}
          <NotificationsSwitch
            field={field}
            fieldType={fieldType}
            value={newsletterPushNotifications}
          />
        </Stack>
      );
    };

    return (
      <Stack spacing={fieldSpacing} marginTop={formMargin}>
        {header()}
        {newsletter()}
        {emailField()}
        {pushNotificationsField()}
      </Stack>
    );
  };
  const unsubAllOffersAndUpdatesSection = () => {
    const field = AccountNotificationsField.allOffersUpdates;

    const header = () => {
      return (
        <Text
          text={t("unsubAllOffersUpdates")}
          variant={TypographyVariant.h5}
          bold={true}
        />
      );
    };

    const description = () => {
      return (
        <Text
          text={t("unsubAllOffersUpdatesDescription")}
          variant={TypographyVariant.subtitle1}
          bold={false}
          color="grey"
        />
      );
    };

    const allOffersAndUpdates = () => {
      return (
        <Text
          text={t("allOffersAndUpdates")}
          variant={TypographyVariant.h6}
          bold={true}
        />
      );
    };

    const emailField = () => {
      const fieldType = AccountNotificationsFieldType.email;

      const emailLabel = () => {
        const label = () => {
          return (
            <Text
              text={t("email")}
              variant={TypographyVariant.h6}
              bold={false}
            />
          );
        };

        return (
          <Stack>
            {label()}
            {status(allOffersUpdatesEmail)}
          </Stack>
        );
      };

      return (
        <Stack
          direction={"row"}
          justifyContent="space-between"
          width={fieldWidth}
        >
          {emailLabel()}
          <NotificationsSwitch
            field={field}
            fieldType={fieldType}
            value={allOffersUpdatesEmail}
          />
        </Stack>
      );
    };

    const pushNotificationsField = () => {
      const fieldType = AccountNotificationsFieldType.pushNotifications;

      const pushNotificationsLabel = () => {
        const label = () => {
          return (
            <Text
              text={t("pushNotifications")}
              variant={TypographyVariant.h6}
              bold={false}
            />
          );
        };

        return (
          <Stack>
            {label()}
            {status(allOffersUpdatesPushNotifications)}
          </Stack>
        );
      };

      return (
        <Stack
          direction={"row"}
          justifyContent="space-between"
          width={fieldWidth}
        >
          {pushNotificationsLabel()}
          <NotificationsSwitch
            field={field}
            fieldType={fieldType}
            value={allOffersUpdatesPushNotifications}
          />
        </Stack>
      );
    };

    return (
      <Stack spacing={fieldSpacing} marginTop={formMargin}>
        <Stack>
          {header()}
          {description()}
        </Stack>
        {allOffersAndUpdates()}
        {emailField()}
        {pushNotificationsField()}
      </Stack>
    );
  };

  return (
    <Box>
      <Box marginY={margin}>
        {breadcrumbNavigator()}
        {travelTipsAndOffersSection()}
        {unsubAllOffersAndUpdatesSection()}
      </Box>
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertText={alertText}
        alertType={alertType}
      />
    </Box>
  );
};

export default AccountNotifications;
