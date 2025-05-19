"use client";

import RedirectFromLoginSignupSnackbar from "@/app/[locale]/itinerary/components/redirect-from-login-signup-snackbar";
import ReviewItinerary from "@/app/[locale]/itinerary/components/review-itinerary/review-itinerary";
import SaveItinerary from "@/app/[locale]/itinerary/components/save-itinerary/save-itinerary";
import { ITINERARY_STYLES } from "@/app/[locale]/itinerary/components/styles";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { ReviewItineraryProvider } from "@/contexts/reviewItineraryContext";
import { SaveItineraryProvider } from "@/contexts/saveItineraryContext";
import { useItinerary } from "@/hooks/useItinerary";
import { CircularProgress, Container, Slide } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const ItineraryPage = ({}: {}) => {
  const {
    isHandlingRedirect,
    containerHeight,
    itineraryPageStep,
    saveItineraryRef,
    reviewItineraryRef,
    updateItineraryGeneratedBy,
    saveItineraryToUser,
    setIsHandlingRedirect,
    setShowSnackbar,
    params,
    setItineraryPageStep,
  } = useItinerary();
  const { data: session } = useSession();
  const email = session?.user.email;

  const styles = ITINERARY_STYLES;

  useEffect(() => {
    const handleRedirectFromLoginSignup = async () => {
      setIsHandlingRedirect(true);

      // update the itinerary document's generated_by field to their email address
      const data = {
        email: email!,
        itineraryId: params.id,
      };
      await updateItineraryGeneratedBy.mutateAsync(data);

      // add the itinerary to the user's document in MongoDB
      await saveItineraryToUser.mutateAsync(data);

      // clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      setShowSnackbar(true);
      setIsHandlingRedirect(false);
      setItineraryPageStep(ItineraryPageStep.reviewItinerary);
    };

    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");

    if (email && (from === "login" || from === "signup")) {
      // if the user was redirected back here from login/signup, then it means that they were previous viewing this itinerary but was not logged in and were instructed to do so
      handleRedirectFromLoginSignup();
    }
  }, [email]);

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
          <SaveItineraryProvider>
            <SaveItinerary />
          </SaveItineraryProvider>
        </div>
      </Slide>
      <RedirectFromLoginSignupSnackbar />
    </Container>
  );
};

export default ItineraryPage;
