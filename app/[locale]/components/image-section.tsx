import { Stack } from "@mui/material";
import ImageColumn from "./image-column";
import { HOME_STYLES } from "./styles";

const ImageSection = () => {
  const styles = HOME_STYLES;

  const allImages = [
    "/travel_1.jpg",
    "/travel_2.jpg",
    "/travel_3.jpg",
    "/travel_4.jpg",
  ];

  const leftImages = allImages.slice(0, 2);
  const rightImages = allImages.slice(2, 4);

  return (
    <Stack
      direction="row"
      sx={{
        width: { xs: "100%", md: styles.SECTION_WIDTH },
        justifyContent: "center",
      }}
    >
      <ImageColumn images={leftImages} left={true} />
      <ImageColumn images={rightImages} left={false} />
    </Stack>
  );
};

export default ImageSection;
