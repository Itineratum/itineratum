import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import noodles from "@/public/noodles.png";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { HOME_STYLES } from "../../styles";
const RightImage = () => {
  const { inView } = useNewsletterSignup();

  const styles = HOME_STYLES.NEWSLETTER_SIGNUP;

  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={inView ? { x: "0%", opacity: 1 } : {}}
      transition={{
        duration: styles.ROLL_IN_ANIMATION_DURATION,
        ease: "easeOut",
      }}
    >
      <Box
        sx={{ position: "relative", top: "-17%", scale: { xs: 0.8, md: 1 } }}
      >
        <Image src={noodles} alt={"A bowl of noodles"} />
      </Box>
    </motion.div>
  );
};

export default RightImage;
