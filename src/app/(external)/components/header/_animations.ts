import { Variants } from "framer-motion";

export const slideDown: Variants = {
  hidden: { 
    y: -10, 
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};