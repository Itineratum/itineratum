import { trpc } from "@/app/_trpc/client";
import { OrDivider } from "@/components/atoms/or-divider";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import TextInputField from "@/components/molecules/text-input-field";
import { AlertType } from "@/constants/enums/alertType";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { TypographyVariant } from "@/constants/enums/theme";
import endpointsConst from "@/constants/pages/endpoints.json";
import { SaveItineraryFormData } from "@/constants/types/formData/saveItineraryFormData";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

const SaveItinerary = ({
  itineraryId,
  setItineraryPageStep,
}: {
  itineraryId: string;
  setItineraryPageStep: Dispatch<SetStateAction<ItineraryPageStep>>;
}) => {
  const t = useTranslations("itinerary");
  const router = useRouter();
  const locale = useLocale();
  const {
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SaveItineraryFormData>();

  const emailId = "email";
  const email = watch(emailId);

  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const spacing = 8;

  const emailItinerary = trpc.itinerary.emailItinerary.useMutation();

  const backButton = () => {
    const handleOnClick = () => {
      setItineraryPageStep(ItineraryPageStep.reviewItinerary);
    };

    return (
      <IconButton onClick={handleOnClick} color="inherit">
        <ArrowBackIcon />
      </IconButton>
    );
  };

  const instructions = () => {
    return (
      <Text
        text={t("saveItineraryInstructions") + ":"}
        variant={TypographyVariant.h5}
        bold={true}
      />
    );
  };

  const loginSignUpButtons = () => {
    const spacing = 2;

    const loginButton = () => {
      const handleOnClick = () => {
        const returnUrl = `/${endpointsConst.itinerary.endpoint}/${itineraryId}?from=login`;
        const loginPath = buildLocaleEndpoint(
          locale,
          `${endpointsConst.login.endpoint}?returnUrl=${encodeURIComponent(returnUrl)}`,
        );
        router.push(loginPath);
      };

      return (
        <Button variant="contained" onClick={handleOnClick}>
          {t("login")}
        </Button>
      );
    };

    const signUpButton = () => {
      const handleOnClick = () => {
        const returnUrl = `/${endpointsConst.itinerary.endpoint}/${itineraryId}?from=signup`;
        const signupPath = buildLocaleEndpoint(
          locale,
          `${endpointsConst.signUp.endpoint}?returnUrl=${encodeURIComponent(returnUrl)}`,
        );
        router.push(signupPath);
      };

      return (
        <Button variant="outlined" onClick={handleOnClick}>
          {t("signUp")}
        </Button>
      );
    };

    return (
      <Stack
        direction="row"
        spacing={spacing}
        display="flex"
        justifyContent="center"
        width="100%"
      >
        {loginButton()}
        {signUpButton()}
      </Stack>
    );
  };

  const emailField = () => {
    const spacing = 2;

    return (
      <Stack
        direction="column"
        spacing={spacing}
        display="flex"
        alignItems="center"
        width="100%"
      >
        <Text
          text={t("emailInstructions")}
          variant={TypographyVariant.h6}
          bold={false}
        />
        <Box width="75%">
          <TextInputField
            name={emailId}
            label={t("email")}
            control={control}
            errorMessage={t("emailError")}
            errors={errors}
            value={email}
            isPasswordInputField={false}
          />
        </Box>
      </Stack>
    );
  };

  const proceedButton = () => {
    const spacing = 2;
    const loadingAnimationSize = 24;

    const handleOnClick = async () => {
      setShowAlert(false);
      const emailValid = await trigger(emailId);

      if (emailValid) {
        setIsSendingEmail(true);
        const data = {
          email,
          itineraryId,
        };
        await emailItinerary.mutateAsync(data);
        setShowAlert(true);
        setIsSendingEmail(false);
      }
    };

    return (
      <Stack
        direction="column"
        display="flex"
        width="100%"
        alignItems="flex-end"
        spacing={spacing}
      >
        <Button
          variant="contained"
          disabled={isSendingEmail}
          onClick={handleOnClick}
        >
          <Stack direction="row" spacing={spacing}>
            {isSendingEmail && <CircularProgress size={loadingAnimationSize} />}
            <Text
              text={isSendingEmail ? t("emailingItinerary") : t("proceed")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        </Button>
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertText={t("emailSuccess")}
          alertType={AlertType.success}
        />
      </Stack>
    );
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "fit-content",
      }}
    >
      <Stack
        direction="column"
        spacing={spacing}
        display="flex"
        alignItems="flex-start"
      >
        <Stack
          direction="column"
          spacing={spacing / 2}
          display="flex"
          alignItems="flex-start"
        >
          {backButton()}
          {instructions()}
        </Stack>
        {loginSignUpButtons()}
        <OrDivider formMargin={0} />
        {emailField()}
        {proceedButton()}
      </Stack>
    </Container>
  );
};

export default SaveItinerary;
