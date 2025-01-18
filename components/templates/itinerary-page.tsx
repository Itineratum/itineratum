"use client";

import ReviewItinerary from "@/app/[locale]/itinerary/components/review-itinerary";
import SaveItinerary from "@/app/[locale]/itinerary/components/save-itinerary";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { Container, Slide } from "@mui/material";
import { SetStateAction, useEffect, useRef, useState } from "react";

const ItineraryPage = ({ params }: { params: { id: string } }) => {
  const [itineraryPageStep, setItineraryPageStep] = useState<ItineraryPageStep>(
    ItineraryPageStep.reviewItinerary,
  );
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const reviewItineraryRef = useRef<HTMLDivElement>(null);
  const saveItineraryRef = useRef<HTMLDivElement>(null);

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
          <SaveItinerary setItineraryPageStep={setItineraryPageStep} />
        </div>
      </Slide>
    );
  };

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
    </Container>
  );
};

export default ItineraryPage;
