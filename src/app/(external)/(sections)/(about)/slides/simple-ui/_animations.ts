import { Variants } from "framer-motion";

// Варианты анимации для контейнера с задержкой между детьми
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

// Варианты анимации для текстовых элементов
export const textItemVariants: Variants = {
    hidden: { 
        y: 20, 
        opacity: 0,
        filter: "blur(4px)"
    },
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

// Варианты анимации для заголовка с акцентом
export const captureVariants: Variants = {
    hidden: { 
        scale: 0.95, 
        opacity: 0 
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 15,
            duration: 0.8
        }
    }
};

// Варианты анимации для ссылки
export const linkVariants: Variants = {
    hidden: { 
        x: -20, 
        opacity: 0,
        scale: 0.9 
    },
    visible: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 12,
            delay: 0.4
        }
    }
};

// Варианты анимации для кругов
export const circleVariants: Variants = {
    hidden: (custom: { index: number }) => ({
        scale: 0,
        opacity: 0,
        rotate: custom.index === 0 ? -90 : 90,
        x: custom.index === 0 ? 50 : -50,
        y: custom.index === 0 ? 50 : -50
    }),
    visible: (custom: { index: number }) => ({
        scale: 1,
        opacity: 1,
        rotate: 0,
        x: 0,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15,
            delay: custom.index * 0.2 + 0.3,
            duration: 0.8
        }
    })
};

// Варианты анимации для иконки стрелки
export const arrowVariants: Variants = {
    hidden: { 
        x: -10, 
        opacity: 0,
        rotate: -90 
    },
    visible: {
        x: 0,
        opacity: 1,
        rotate: 0,
        transition: {
            delay: 0.6,
            duration: 0.5,
            ease: "easeOut"
        }
    },
    hover: {
        x: 5,
        rotate: 45,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
};
