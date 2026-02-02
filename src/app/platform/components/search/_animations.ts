import { Variants } from "framer-motion";

export const canvasVariants: Variants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
        opacity: 1, 
        backdropFilter: 'blur(5px)',
        transition: { duration: 0.2 }
    }
};

export const areaVariants: Variants ={
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
        duration: 0.2,
        ease: "easeOut"
        }
    }
};