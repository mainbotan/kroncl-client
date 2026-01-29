export const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
        duration: 0.3,
        ease: "easeOut"
        }
    }
};

export const titleVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
        duration: 0.4,
        ease: "easeOut"
        }
    }
};

export const sectionHoverVariants = {
    hover: {
        y: -4,
        transition: {
        duration: 0.2,
        ease: "easeOut"
        }
    }
};
