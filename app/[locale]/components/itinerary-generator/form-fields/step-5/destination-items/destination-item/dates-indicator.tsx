import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";

const DatesIndicator = ({
  destination,
}: {
  destination: UserRequestedDestination;
}) => {
  const { fields } = useItineraryGenerator();

  const format = "D MMM YYYY";
  const destinationItem = fields
    .getValues("userRequestedDestinations")
    .filter((dest) => dest.name === destination.name);
  const destinationStartDate = destinationItem[0].startDate;
  const destinationEndDate = destinationItem[0].endDate;
  const numOfDays = destinationEndDate.diff(destinationStartDate, "days") + 1;

  return (
    <Text
      text={
        numOfDays === 1
          ? `${destinationStartDate.format(format)}`
          : `${destinationStartDate.format(format)} to ${destinationEndDate.format(format)}`
      }
      variant={TypographyVariant.body1}
      bold={true}
    />
  );
};

export default DatesIndicator;
