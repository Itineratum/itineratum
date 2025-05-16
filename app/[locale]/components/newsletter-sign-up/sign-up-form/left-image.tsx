import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import leaningTowerOfPisa from "@/public/pisa.png";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { HOME_STYLES } from "../../styles";

const LeftImage = () => {
  const { inView } = useNewsletterSignup();

  const styles = HOME_STYLES.NEWSLETTER_SIGNUP;

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={inView ? { x: "-25%", opacity: 1 } : {}}
      transition={{
        duration: styles.ROLL_IN_ANIMATION_DURATION,
        ease: "easeOut",
      }}
    >
      <Box
        sx={{
          position: "relative",
          top: { xs: "40px", md: 0 },
          left: { xs: "-150px", md: 0 },
          scale: { xs: 0.8, md: 1 },
        }}
      >
        <Image src={leaningTowerOfPisa} alt={"The Leaning Tower of Pisa"} />
      </Box>
    </motion.div>
  );
};

export default LeftImage;
