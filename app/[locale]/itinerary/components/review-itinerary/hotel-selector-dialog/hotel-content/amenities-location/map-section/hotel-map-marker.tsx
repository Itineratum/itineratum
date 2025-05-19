import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Position } from "@/lib/pythonBackend/types";
import { AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";

const HotelMapMarker = ({ hotelPosition }: { hotelPosition: Position }) => {
  const {
    setHotelMarkerPopupShown,
    hotelMarkerPopupShown,
    hotelMarker,
    hotelMarkerRef,
    hotel,
  } = useHotelSelector();

  const color = colorsConst.components.mapSection.hotel;

  const handleOnClick = () => {
    setHotelMarkerPopupShown(true);
  };

  const popupHandleOnClose = () => {
    setHotelMarkerPopupShown(false);
  };

  return (
    hotel && (
      <AdvancedMarker
        key={JSON.stringify(hotelPosition)}
        ref={hotelMarkerRef}
        position={hotelPosition}
        onClick={handleOnClick}
        clickable={true}
      >
        {/* popup */}
        {hotelMarkerPopupShown && (
          <InfoWindow anchor={hotelMarker} onClose={popupHandleOnClose}>
            <Text
              text={hotel?.name!}
              variant={TypographyVariant.body1}
              bold={false}
            />
          </InfoWindow>
        )}
        <Pin
          background={color}
          borderColor={color}
          glyphColor={colorsConst.components.mapSection.glyphColor}
          scale={2}
        />
      </AdvancedMarker>
    )
  );
};

export default HotelMapMarker;
