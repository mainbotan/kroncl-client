import Button from '@/assets/ui-kit/button/button';
import styles from '../../layout.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants, itemVariants } from '../../sign_in/_animations';


export function External() {
    return (
        <>
        <div className={styles.line}>
            <span className={styles.part} />
            <span className={styles.word}>или</span>
            <span className={styles.part} />
        </div>
        <div className={styles.actions}>
            <motion.section 
                className={styles.section}
                variants={itemVariants}
            >
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button 
                        className={styles.action} 
                        variant='elevated'
                    >
                        Google
                    </Button>
                </motion.div>
            </motion.section>
            <motion.section 
                className={styles.section}
                variants={itemVariants}
            >
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button 
                        className={styles.action} 
                        variant='elevated'
                    >
                        Github
                    </Button>
                </motion.div>
            </motion.section>
        </div>
        </>
    )
}