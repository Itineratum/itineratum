import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { TravelTime } from "@/lib/pythonBackend/types";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Stack } from "@mui/material";

const TravelCard = ({ travelTime }: { travelTime: TravelTime }) => {
  const spacing = 2;

  const icon = () => <DirectionsCarIcon />;

  return (
    <Stack direction="column" alignItems="center">
      {"|"}
      <Stack direction="row" alignItems="center" spacing={spacing}>
        {icon()}
        <Text
          text={`${travelTime.duration} (${travelTime.distance})`}
          variant={TypographyVariant.body1}
          bold={true}
        />
      </Stack>
      {"|"}
    </Stack>
  );
};

export default TravelCard;
