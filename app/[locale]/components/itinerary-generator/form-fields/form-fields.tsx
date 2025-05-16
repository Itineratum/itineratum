import { Step1Provider } from "@/contexts/step1Context";
import { Step2Provider } from "@/contexts/step2Context";
import { Step3Provider } from "@/contexts/step3Context";
import { Step5Provider } from "@/contexts/step5Context";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { Container } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { HOME_STYLES } from "../../styles";
import Step1 from "./step-1/step-1";
import Step2 from "./step-2/step-2";
import Step3 from "./step-3/step-3";
import Step4 from "./step-4/step-4";
import Step5 from "./step-5/step-5";
import Step6 from "./step-6/step-6";

export const steps = [
  <Container key={0}>
    <Step1Provider>
      <Step1 />
    </Step1Provider>
  </Container>,
  <Container key={1}>
    <Step2Provider>
      <Step2 />
    </Step2Provider>
  </Container>,
  <Container key={2}>
    <Step3Provider>
      <Step3 />
    </Step3Provider>
  </Container>,
  <Container key={3}>
    <Step4 />
  </Container>,
  <Container key={5}>
    <Step5Provider>
      <Step5 />
    </Step5Provider>
  </Container>,
  <Container key={6}>
    <Step6 />
  </Container>,
];

export const FormFields = () => {
  const { direction, activeStep } = useItineraryGenerator();

  const styles = HOME_STYLES.ITINERARY_GENERATOR;

  return (
    <motion.div
      layout
      style={{
        position: "relative",
        width: "100%",
        marginTop: styles.MARGIN_TOP,
      }}
      transition={{ duration: styles.FORM_FIELDS.TRANSITION_DURATION }}
    >
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={activeStep}
          custom={direction}
          variants={styles.VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: styles.FORM_FIELDS.TRANSITION_DURATION }}
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <Container
            sx={{
              display: "flex",
            }}
          >
            {steps[activeStep]}
          </Container>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
