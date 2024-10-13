"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box, Button, Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const ProtectedRoute = () => {
  const t = useTranslations("protected");
  const router = useRouter();

  const spacing: number = 7;

  const heading = () => {
    const margin: number = 5;

    return (
      <Box marginY={margin}>
        <Text text={t("heading")} variant={TypographyVariant.h2} bold={true} />
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

  const recovery = () => {
    return (
      <Text text={t("recovery")} variant={TypographyVariant.h5} bold={false} />
    );
  };

  const loginButton = () => {
    const width: string = "30%";

    const handleOnClick = () => {
      router.push("/login");
    };

    return (
      <Button
        type="button"
        variant="contained"
        color="primary"
        sx={{ maxWidth: width }}
        onClick={handleOnClick}
      >
        {t("login")}
      </Button>
    );
  };

  return (
    <Container maxWidth="md">
      {heading()}
      <Stack spacing={spacing}>
        {description()}
        {recovery()}
        {loginButton()}
      </Stack>
    </Container>
  );
};

export default ProtectedRoute;
