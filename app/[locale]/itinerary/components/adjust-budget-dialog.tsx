import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { Currency } from "@/constants/enums/currency";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AdjustBudgetFormData } from "@/constants/types/formData/adjustBudgetFormData";
import { runPipeline } from "@/lib/pythonBackend/pythonBackend";
import { GenerateItineraryJSON } from "@/lib/pythonBackend/types";
import { isValidIntegerRegex } from "@/utils/itineraryGeneratorValidation";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AdjustBudgetDialog = ({
  open,
  setOpen,
  itineraryRequest,
  itineraryId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  itineraryRequest: GenerateItineraryJSON;
  itineraryId: string;
}) => {
  const t = useTranslations("itinerary.adjustBudgetDialog");
  const router = useRouter();

  const currency: Currency = itineraryRequest.payload.localisation
    .currency as Currency;
  const currentBudget: number = itineraryRequest.payload.budget;
  const fields = useForm<AdjustBudgetFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      budget: currentBudget,
    },
  });

  const [adjustingBudget, setAdjustingBudget] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");

  const budget = "budget";
  const spacing = 4;
  const width = "300px";

  const adjustItineraryBudget =
    trpc.itinerary.adjustItineraryBudget.useMutation();
  const utils = trpc.useUtils();

  const handleOnClose = () => {
    if (!adjustingBudget) setOpen(false);
  };

  const title = () => {
    return (
      <DialogTitle>
        <Text
          text={t("adjustBudget")}
          variant={TypographyVariant.h4}
          bold={false}
        />
      </DialogTitle>
    );
  };

  const description = () => {
    return (
      <DialogContentText>
        <Text
          text={t("description")}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
      </DialogContentText>
    );
  };

  const budgetField = () => {
    const textLabelMarginRight: number = 2;

    const budgetValidation = (budgetInput: number) => {
      const isValid = budgetInput > 0;
      return isValid ? true : t("budgetErrorMessage");
    };

    return (
      <Box display="flex" alignItems="center">
        <Box mr={textLabelMarginRight}>
          <Text
            text={
              t("budget") +
              ": " +
              Currency[currency as unknown as keyof typeof Currency]
            }
            variant={TypographyVariant.body1}
            bold={true}
          />
        </Box>
        <Controller
          name={budget}
          control={fields.control}
          rules={{
            validate: budgetValidation,
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...fields.register(budget)}
              variant="outlined"
              label={t("budgetDescription")}
              InputLabelProps={{
                style: {
                  color: colorsConst.palette.text.grey,
                  fontSize: "12px",
                },
              }}
              onChange={(event) => {
                const value = event.target.value;
                field.onChange(value);
                fields.trigger(budget);
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: isValidIntegerRegex(),
              }}
              error={fieldState.invalid}
              helperText={fieldState.invalid ? t("budgetErrorMessage") : ""}
              sx={{ width }}
            />
          )}
        />
      </Box>
    );
  };

  const adjustBudgetButton = () => {
    const width = "45%";
    const loadingAnimationSize: number = 24;
    const spacing = 2;

    const handleOnClick = async () => {
      setAdjustingBudget(true);

      try {
        // validate the itinerary request with the adjusted budget
        itineraryRequest.payload.budget = Number(fields.getValues(budget));
        const newItinerary = await runPipeline(itineraryRequest);
        const data = {
          itineraryId,
          request: newItinerary.request,
          itinerary: newItinerary.detailed_itinerary ?? [],
          hotels: newItinerary.hotel_search_results ?? [],
          flights: newItinerary.flight_search_results ?? [],
        };
        await adjustItineraryBudget.mutateAsync(data);
        utils.itinerary.getItinerary.invalidate();
        setAdjustingBudget(false);
        setOpen(false);
        router.refresh();
      } catch (error: any) {
        console.error(error);
        setAlertText(error.message);
        setShowAlert(true);
      } finally {
        setAdjustingBudget(false);
      }
    };

    return (
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{ width }}
          disabled={adjustingBudget}
        >
          {adjustingBudget ? (
            <Stack
              direction="row"
              spacing={spacing}
              display="flex"
              alignItems="center"
            >
              <CircularProgress size={loadingAnimationSize} />
              {t("adjusting")}
            </Stack>
          ) : (
            t("adjustBudget")
          )}
        </Button>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      fullScreen={false}
      maxWidth={false}
    >
      {title()}
      <DialogContent>
        <Stack direction="column" spacing={spacing}>
          {description()}
          {budgetField()}
          {adjustBudgetButton()}
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={alertText}
            alertType={AlertType.error}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AdjustBudgetDialog;
