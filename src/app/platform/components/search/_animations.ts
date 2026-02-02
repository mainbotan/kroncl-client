import { Variants } from "framer-motion";

export const optimizedCanvasVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.15,
      ease: "easeOut"
    }
  }
};

export const optimizedAreaVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.15,
      ease: "easeOut"
    }
  }
};