import Text from "@/components/atoms/text";
import ThreeGuysBackground from "@/components/atoms/three-guys-background";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box, Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import LoginButton from "./components/login-button";

const ProtectedRoute = () => {
  const t = useTranslations("protected");

  const spacing: number = 7;

  const heading = () => {
    const margin: number = 5;

    return (
      <Box marginY={margin}>
        <Text
          text={t("heading").toUpperCase()}
          variant={TypographyVariant.h1}
          bold={true}
        />
      </Box>
    );
  };

  const description = () => {
    return (
      <Text
        text={t("description")}
        variant={TypographyVariant.h5}
        bold={false}
      />
    );
  };

  return (
    <ThreeGuysBackground>
      <Container maxWidth="md" sx={{ textAlign: "center", zIndex: 1 }}>
        {heading()}
        <Stack spacing={spacing} sx={{ display: "flex", alignItems: "center" }}>
          {description()}
          <LoginButton />
        </Stack>
      </Container>
    </ThreeGuysBackground>
  );
};

export default ProtectedRoute;
