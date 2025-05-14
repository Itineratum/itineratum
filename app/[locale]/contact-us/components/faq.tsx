import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

const FAQ = ({
  questionString,
  answerString,
}: {
  questionString: string;
  answerString: string;
}) => {
  return (
    <Accordion elevation={0} square>
      <AccordionSummary expandIcon={<ArrowDropDownOutlinedIcon />}>
        <Text
          text={questionString}
          variant={TypographyVariant.h5}
          bold={true}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Text
          text={answerString}
          variant={TypographyVariant.body1}
          bold={false}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQ;
