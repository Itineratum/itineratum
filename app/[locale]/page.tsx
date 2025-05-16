import constText from "@/constants/pages/texts.json";
import { ItineraryGeneratorProvider } from "@/contexts/itineraryGeneratorContext";
import { NewsletterSignupProvider } from "@/contexts/newsletterSignupContext";
import arrow from "@/public/arrow.svg";
import { Box, Container } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import ItineraryGenerator from "./components/itinerary-generator/itinerary-generator";
import NewsletterSignup from "./components/newsletter-sign-up/newsletter-sign-up";
import { HOME_STYLES } from "./components/styles";
import {
  TextImageSection,
  TextImageSectionMobile,
} from "./components/text-image-section";

export const metadata: Metadata = {
  title: constText.pageTitle,
};

const Home = () => {
  const styles = HOME_STYLES;

  return (
    <Container
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        paddingBottom: styles.PADDING_BOTTOM,
      }}
    >
      <TextImageSection />
      <TextImageSectionMobile />
      {/* arrow image */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "180px", md: "420px" },
          left: { xs: "120px", md: "160px" },
        }}
      >
        <Image src={arrow} alt={"Orange arrow"} />
      </Box>
      <ItineraryGeneratorProvider>
        <ItineraryGenerator />
      </ItineraryGeneratorProvider>
      <NewsletterSignupProvider>
        <NewsletterSignup />
      </NewsletterSignupProvider>
    </Container>
  );
};

export default Home;
