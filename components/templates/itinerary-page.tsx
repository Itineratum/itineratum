"use client";

import ReviewItinerary from "@/app/[locale]/itinerary/components/review-itinerary";
import SaveItinerary from "@/app/[locale]/itinerary/components/save-itinerary";
import { trpc } from "@/app/_trpc/client";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { CircularProgress, Container, Slide, Snackbar } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const ItineraryPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("itinerary");
  const { data: session } = useSession();
  const email = session?.user.email;

  const [itineraryPageStep, setItineraryPageStep] = useState<ItineraryPageStep>(
    ItineraryPageStep.reviewItinerary,
  );
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const reviewItineraryRef = useRef<HTMLDivElement>(null);
  const saveItineraryRef = useRef<HTMLDivElement>(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(false);

  const updateItineraryGeneratedBy =
    trpc.itinerary.updateItineraryGeneratedBy.useMutation();
  const saveItineraryToUser = trpc.user.saveItineraryToUser.useMutation();

  useEffect(() => {
    const activeRef =
      itineraryPageStep === ItineraryPageStep.reviewItinerary
        ? reviewItineraryRef
        : saveItineraryRef;

    if (!activeRef.current) return;

    // Reset height before measuring new component
    setContainerHeight("auto");

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        requestAnimationFrame(() => {
          setContainerHeight(`${entry.contentRect.height}px`);
        });
      }
    });

    resizeObserver.observe(activeRef.current);
    return () => resizeObserver.disconnect();
  }, [itineraryPageStep]);

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
    };

    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");

    if (email && (from === "login" || from === "signup")) {
      // if the user was redirected back here from login/signup, then it means that they were previous viewing this itinerary but was not logged in and were instructed to do so
      handleRedirectFromLoginSignup();
    }
  }, [email]);

  const pageTransitionDuration = 500;

  const reviewItinerary = () => {
    return (
      <Slide
        direction="right"
        appear={false}
        in={itineraryPageStep === ItineraryPageStep.reviewItinerary}
        timeout={pageTransitionDuration}
        mountOnEnter
        unmountOnExit
      >
        <div ref={reviewItineraryRef} style={{ width: "100%" }}>
          <ReviewItinerary
            params={params}
            setItineraryPageStep={setItineraryPageStep}
          />
        </div>
      </Slide>
    );
  };

  const saveItinerary = () => {
    return (
      <Slide
        direction="left"
        in={itineraryPageStep === ItineraryPageStep.saveItinerary}
        timeout={pageTransitionDuration}
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
    );
  };

  const redirectFromLoginSignupSnackbar = () => {
    const snackbarAutoHideDuration = 5000;

    const handleOnClose = (event?: any, reason?: any) => {
      if (reason === "clickaway") {
        return;
      }

      setShowSnackbar(false);
    };

    return (
      <Snackbar
        open={showSnackbar}
        onClose={handleOnClose}
        autoHideDuration={snackbarAutoHideDuration}
        message={t("itinerarySaved")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    );
  };

  if (isHandlingRedirect) {
    return <CircularProgress />;
  }

  return (
    <Container
      sx={{
        position: "relative",
        height: containerHeight,
        transition: `height ${pageTransitionDuration}ms ease-in-out`,
        minHeight: "90vh",
      }}
    >
      {reviewItinerary()}
      {saveItinerary()}
      {redirectFromLoginSignupSnackbar()}
    </Container>
  );
};

export default ItineraryPage;
