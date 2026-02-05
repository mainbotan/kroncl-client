import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05 }
    })
};

export const staggerChildren: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const boxHover: Variants = {
    hover: { 
        scale: 1.3, 
        y: -4,
        transition: { duration: 0.15, type: 'spring' }
    }
};
