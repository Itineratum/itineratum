import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorConst from "@/constants/pages/colors.json";
import constText from "@/constants/pages/texts.json";
import arrow from "@/public/arrow.svg";
import { Box, Container, Stack } from "@mui/material";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ImageColumn from "./components/image-column";
import ItineraryGenerator from "./components/itinerary-generator/itinerary-generator";
import NewsletterSignup from "./components/newsletter-sign-up";

export const metadata: Metadata = {
  title: constText.pageTitle,
};

const Home = () => {
  const t = useTranslations("home");

  const sectionWidth: string = "50%";
  const paddingBottom: string = "20px";

  const textSection = () => {
    const title = () => (
      <Text
        text={t("title")}
        variant={TypographyVariant.h4}
        bold={false}
        color={colorConst.palette.secondary.main}
      />
    );

    const tagline = () => (
      <Text text={t("tagline")} variant={TypographyVariant.h1} bold={true} />
    );

    const callToAction = () => (
      <Text
        text={t("callToAction")}
        variant={TypographyVariant.h4}
        bold={false}
        color={colorConst.palette.text.grey}
      />
    );

    return (
      <Stack
        sx={{
          width: { xs: "100%", md: sectionWidth },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {title()}
        {tagline()}
        {callToAction()}
      </Stack>
    );
  };

  const imageSection = () => {
    const allImages = [
      "/travel_1.jpg",
      "/travel_2.jpg",
      "/travel_3.jpg",
      "/travel_4.jpg",
    ];

    const leftColumn = () => {
      const leftImages = allImages.slice(0, 2);
      return <ImageColumn images={leftImages} left={true} />;
    };

    const rightColumn = () => {
      const rightImages = allImages.slice(2, 4);
      return <ImageColumn images={rightImages} left={false} />;
    };

    return (
      <Stack
        direction="row"
        sx={{
          width: { xs: "100%", md: sectionWidth },
          justifyContent: "center",
        }}
      >
        {leftColumn()}
        {rightColumn()}
      </Stack>
    );
  };

  const arrowImage = () => (
    <Box
      sx={{
        position: "absolute",
        top: { xs: "180px", md: "420px" },
        left: { xs: "120px", md: "160px" },
      }}
    >
      <Image src={arrow} alt={"Orange arrow"} />
    </Box>
  );

  const textImageSection = () => {
    return (
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {textSection()}
        {imageSection()}
      </Box>
    );
  };

  const textImageSectionMobile = () => {
    return (
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {textSection()}
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1,
            opacity: 0.3,
          }}
        >
          {imageSection()}
        </Box>
      </Box>
    );
  };

  return (
    <Container
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        paddingBottom,
      }}
    >
      {textImageSection()}
      {textImageSectionMobile()}
      {arrowImage()}
      <ItineraryGenerator />
      <NewsletterSignup />
    </Container>
  );
};

export default Home;
