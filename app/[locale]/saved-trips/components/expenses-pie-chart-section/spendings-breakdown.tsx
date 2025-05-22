import Text from "@/components/atoms/text";
import { SpendingCategory } from "@/constants/enums/spendingCategory";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { getItinerarySpendingsBreakdown } from "@/lib/pythonBackend/utils";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DaySpendingsBreakdownItem from "./day-spendings-breakdown-item";

export const SpendingsBreakdown = () => {
  const { selectedItinerary } = useSavedTrips();

  const [
    selectedItinerarySpendingsBreakdown,
    setSelectedItinerarySpendingsBreakdown,
  ] = useState<ItinerarySpendingsBreakdown | null>(null);

  useEffect(() => {
    if (selectedItinerary)
      setSelectedItinerarySpendingsBreakdown(
        getItinerarySpendingsBreakdown(selectedItinerary),
      );
  }, [selectedItinerary]);

  const t = useTranslations("savedTrips.expensesPieChart");

  return (
    selectedItinerary && (
      <Container
        sx={{
          my: 4,
        }}
      >
        <Text
          text={t("spendingsBreakdown")}
          variant={TypographyVariant.h5}
          bold={false}
        />
        {selectedItinerarySpendingsBreakdown &&
          selectedItinerarySpendingsBreakdown.map(
            (daySpendingsBreakdown: DaySpendingsBreakdown) => (
              <DaySpendingsBreakdownItem
                key={JSON.stringify(daySpendingsBreakdown)}
                daySpendingsBreakdown={daySpendingsBreakdown}
              />
            ),
          )}
      </Container>
    )
  );
};

export interface EventSpending {
  name: string;
  price: number;
  spendingCategory: SpendingCategory;
}

export interface DaySpendingsBreakdown {
  date: Date;
  spendingsBreakdown: EventSpending[];
}

export type ItinerarySpendingsBreakdown = DaySpendingsBreakdown[];
