import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorConst from "@/constants/pages/colors.json";
import constText from "@/constants/pages/texts.json";
import { Container, Stack } from "@mui/material";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import ImageColumn from "./components/image-column";

export const metadata: Metadata = {
  title: constText.pageTitle,
};

const Home = () => {
  const t = useTranslations("home");

  const sectionWidth: string = "50%";

  const textSection = () => {
    const title = () => {
      return (
        <Text
          text={t("title")}
          variant={TypographyVariant.h4}
          bold={false}
          color={colorConst.palette.secondary.main}
        />
      );
    };

    const tagline = () => {
      return (
        <Text text={t("tagline")} variant={TypographyVariant.h1} bold={true} />
      );
    };

    const callToAction = () => {
      return (
        <Text
          text={t("callToAction")}
          variant={TypographyVariant.h4}
          bold={false}
          color={colorConst.palette.text.grey}
        />
      );
    };

    return (
      <Stack
        sx={{
          width: sectionWidth,
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
      <Stack direction="row" sx={{ width: sectionWidth }}>
        {leftColumn()}
        {rightColumn()}
      </Stack>
    );
  };

  return (
    <Container>
      <Stack direction="row">
        {textSection()}
        {imageSection()}
      </Stack>
    </Container>
  );
};

export default Home;
