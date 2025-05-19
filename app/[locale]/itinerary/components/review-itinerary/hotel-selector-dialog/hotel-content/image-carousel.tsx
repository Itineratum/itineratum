import { useHotelSelector } from "@/hooks/useHotelSelector";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import Carousel from "react-material-ui-carousel";
import { ITINERARY_STYLES } from "../../../styles";

const ImageCarousel = () => {
  const { hotel } = useHotelSelector();

  const isMobile = useMediaQuery("(max-width:600px)");

  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .IMAGE_CAROUSEL;
  const carouselHeight = isMobile ? styles.MOBILE_HEIGHT : styles.HEIGHT;

  return (
    hotel &&
    hotel.images.length > 0 && (
      <Carousel
        height={carouselHeight}
        animation="fade"
        navButtonsAlwaysVisible={true}
      >
        {hotel!.images.map((image) => (
          <Image
            key={image}
            src={image}
            alt={"Hotel image"}
            layout="fill"
            objectFit="contain"
            loading="lazy"
          />
        ))}
      </Carousel>
    )
  );
};

export default ImageCarousel;
