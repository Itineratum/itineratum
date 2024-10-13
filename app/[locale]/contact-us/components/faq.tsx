import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

const FAQ = ({
  questionString,
  answerString,
}: {
  questionString: string;
  answerString: string;
}) => {
  const question = () => {
    return (
      <Text text={questionString} variant={TypographyVariant.h5} bold={true} />
    );
  };

  const answer = () => {
    return (
      <Text
        text={answerString}
        variant={TypographyVariant.body1}
        bold={false}
      />
    );
  };

  return (
    <Accordion elevation={0} square>
      <AccordionSummary expandIcon={<ArrowDropDownOutlinedIcon />}>
        {question()}
      </AccordionSummary>
      <AccordionDetails>{answer()}</AccordionDetails>
    </Accordion>
  );
};

export default FAQ;
