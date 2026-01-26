export const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: {
            duration: 0.3,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

export const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

export const errorVariants = {
    hidden: { 
        x: 50, 
        opacity: 0,
        height: 0,
        marginBottom: 0
    },
    visible: { 
        x: 0, 
        opacity: 1,
        height: "2.5rem",
        transition: { 
            type: "spring",
            stiffness: 300,
            damping: 25
        }
    },
    exit: { 
        x: -50, 
        opacity: 0,
        height: 0,
        marginBottom: 0,
        transition: { duration: 0.2 }
    }
};

export const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.02 }
};

export const loadingVariants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
        }
    }
};
