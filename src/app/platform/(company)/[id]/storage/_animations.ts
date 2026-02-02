import { Variants } from 'framer-motion';

export const statItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

export const progressBarVariants: Variants = {
    initial: { width: "0%" },
    animate: { 
        width: "100%",
        transition: {
            duration: 1,
            ease: "easeInOut"
        }
    }
};

export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};