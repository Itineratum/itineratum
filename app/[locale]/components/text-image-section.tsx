import { Box } from "@mui/material";
import ImageSection from "./image-section";
import TextSection from "./text-section";

export const TextImageSection = () => {
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
      <TextSection />
      <ImageSection />
    </Box>
  );
};

export const TextImageSectionMobile = () => {
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
        <TextSection />
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
        <ImageSection />
      </Box>
    </Box>
  );
};
