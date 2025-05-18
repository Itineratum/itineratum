"use client";

import RedirectFromLoginSignupSnackbar from "@/app/[locale]/itinerary/components/redirect-from-login-signup-snackbar";
import ReviewItinerary from "@/app/[locale]/itinerary/components/review-itinerary/review-itinerary";
import SaveItinerary from "@/app/[locale]/itinerary/components/save-itinerary";
import { ITINERARY_STYLES } from "@/app/[locale]/itinerary/components/styles";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { ReviewItineraryProvider } from "@/contexts/reviewItineraryContext";
import { useItinerary } from "@/hooks/useItinerary";
import { CircularProgress, Container, Slide } from "@mui/material";
import { useEffect } from "react";

const ItineraryPage = ({ params }: { params: { id: string } }) => {
  const {
    isHandlingRedirect,
    containerHeight,
    itineraryPageStep,
    setItineraryPageStep,
    saveItineraryRef,
    reviewItineraryRef,
    setParams,
  } = useItinerary();

  const styles = ITINERARY_STYLES;

  useEffect(() => {
    if (params) setParams(params);
  }, [params]);

  if (isHandlingRedirect) {
    return <CircularProgress />;
  }

  return (
    <Container
      sx={{
        position: "relative",
        height: containerHeight,
        transition: `height ${styles.PAGE_TRANSITION_DURATION}ms ease-in-out`,
        minHeight: "90vh",
      }}
    >
      {/* review itinerary */}
      <Slide
        direction="right"
        appear={false}
        in={itineraryPageStep === ItineraryPageStep.reviewItinerary}
        timeout={styles.PAGE_TRANSITION_DURATION}
        mountOnEnter
        unmountOnExit
      >
        <div ref={reviewItineraryRef} style={{ width: "100%" }}>
          <ReviewItineraryProvider>
            <ReviewItinerary />
          </ReviewItineraryProvider>
        </div>
      </Slide>
      {/* save itinerary */}
      <Slide
        direction="left"
        in={itineraryPageStep === ItineraryPageStep.saveItinerary}
        timeout={styles.PAGE_TRANSITION_DURATION}
        mountOnEnter
        unmountOnExit
      >
        <div ref={saveItineraryRef} style={{ width: "100%" }}>
          <SaveItinerary
            itineraryId={params.id}
            setItineraryPageStep={setItineraryPageStep}
          />
        </div>
      </Slide>
      <RedirectFromLoginSignupSnackbar />
    </Container>
  );
};

export default ItineraryPage;
