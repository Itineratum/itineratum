import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Stack } from "@mui/material";

const TravelCard = ({
  duration,
  distance,
}: {
  duration: string;
  distance: string;
}) => {
  const spacing = 2;

  const icon = () => <DirectionsCarIcon />;

  return (
    <Stack direction="column" alignItems="center">
      {"|"}
      <Stack direction="row" alignItems="center" spacing={spacing}>
        {icon()}
        <Text
          text={`${duration} (${distance})`}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Stack>
      {"|"}
    </Stack>
  );
};

export default TravelCard;
