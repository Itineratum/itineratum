"use client";

import ItineraryCard, {
  itineraryCardHeight,
  itineraryCardOverlapOffset,
  itineraryCardWidth,
} from "@/app/[locale]/saved-trips/components/itinerary-card";
import { trpc } from "@/app/_trpc/client";
import { TypographyVariant } from "@/constants/enums/theme";
import { IItinerary } from "@/constants/types/itinerary";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import { Box, CircularProgress, Container, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Text from "../atoms/text";
import colorsConst from "@/constants/pages/colors.json";

const SavedTripsPage = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const name = session?.user.name;
  const router = useRouter();
  const t = useTranslations("savedTrips");

  const [savedItineraries, setSavedItineraries] = useState<
    Record<string, IItinerary>[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const margin = 5;
  const spacing = 2;

  const getUserSavedItineraries =
    trpc.user.getUserSavedItinerariesAndIds.useQuery({
      email: session?.user.email!,
    });

  useEffect(() => {
    if (!isLoggedIn) router.push("/protected");
  }, [status, router]);

  useEffect(() => {
    if (getUserSavedItineraries.data) {
      setSavedItineraries(
        getUserSavedItineraries.data as unknown as Record<string, IItinerary>[],
      );
      setIsLoading(false);
    }
  }, [getUserSavedItineraries.data]);

  const itinerariesSection = () => {
    const border = `2px solid ${colorsConst.palette.secondary.main}`;
    const borderRadius = "20px";
    const numOfItineraryCards = savedItineraries.length;
    const margin = "16px";
    const spacing = 2;
    const padding = 5;
    const loadingAnimationSize = 24;

    const label = () => {
      return (
        <Text
          text={t("plannedTripsDescription") + ":"}
          variant={TypographyVariant.h5}
          bold={false}
        />
      );
    };

    const noItineraries = () => {
      return (
        <Text
          text={t("noItineraries")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    return (
      <Box
        sx={{
          border,
          borderRadius,
          padding,
          width: itineraryCardWidth + padding,
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress size={loadingAnimationSize} />
          </Box>
        ) : savedItineraries.length === 0 ? (
          noItineraries()
        ) : (
          <Stack direction="column" spacing={spacing}>
            {label()}
            <Box
              sx={{
                position: "relative",
                height:
                  itineraryCardHeight +
                  (numOfItineraryCards - 1) * itineraryCardOverlapOffset,
                marginBottom: margin,
              }}
            >
              {savedItineraries.map((record, index) => {
                const itineraryId = Object.keys(record)[0];
                const itinerary = record[itineraryId];

                return (
                  <ItineraryCard
                    key={itineraryId}
                    title={getItinerarySummaryText(itinerary)}
                    pictureUrl={itinerary.itinerary[0].events[0].photo}
                    itineraryId={itineraryId}
                    numOfCards={numOfItineraryCards}
                    index={index}
                  />
                );
              })}
            </Box>
          </Stack>
        )}
      </Box>
    );
  };

  const calendarTodoSection = () => {
    const calendar = () => {};

    const todoList = () => {};
  };

  return (
    <Container maxWidth="lg">
      <Stack
        display="flex"
        direction="column"
        marginTop={margin}
        marginBottom={margin}
        spacing={spacing}
      >
        <Text
          text={`${t("welcome")}${name ? ` ${name}!` : "!"}`}
          variant={TypographyVariant.h2}
          bold={true}
        />
        <Stack direction="row" spacing={spacing}>
          {itinerariesSection()}
        </Stack>
      </Stack>
    </Container>
  );
};

export default SavedTripsPage;
