"use client";

import { TypographyVariant } from "@/constants/enums/theme";
import { Container, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Text from "../atoms/text";
import { trpc } from "@/app/_trpc/client";
import { IItinerary } from "@/constants/types/itinerary";

const SavedTripsPage = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const name = session?.user.name;
  const router = useRouter();
  const t = useTranslations("savedTrips");

  const [savedItineraries, setSavedItineraries] = useState<IItinerary[]>([]);

  const margin = 5;
  const spacing = 2;

  const getUserSavedItineraries = trpc.user.getUserSavedItineraries.useQuery({
    email: session?.user.email!,
  });

  useEffect(() => {
    if (!isLoggedIn) router.push("/protected");
  }, [status, router]);

  useEffect(() => {
    if (getUserSavedItineraries.data) {
      setSavedItineraries(
        getUserSavedItineraries.data as unknown as IItinerary[],
      );
    }
  }, [getUserSavedItineraries.data]);

  const itinerariesSection = () => {};

  const calendarTodoSection = () => {
    const calendar = () => {};

    const todoList = () => {};
  };

  return (
    <Container maxWidth="md">
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
        <Stack direction="row" spacing={spacing}></Stack>
      </Stack>
    </Container>
  );
};

export default SavedTripsPage;
