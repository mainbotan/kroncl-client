'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Close from '@/assets/ui-kit/icons/close';
import styles from './modal.module.scss';
import { useModalPage } from './context';

export function PlatformModalPage() {
    const { isModalOpen, modalContent, closeModal } = useModalPage();
    const areaRef = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (typeof window !== 'undefined') {
        areaRef.current = document.querySelector('[data-area="true"]');
    }
    }, []);

    useEffect(() => {
        if (!areaRef.current) return;

        if (isModalOpen) {
            areaRef.current.style.setProperty('overflow-y', 'hidden', 'important');
        
            if (modalRef.current) {
                modalRef.current.style.overflowY = 'auto';
            }
            } else {
                areaRef.current.style.removeProperty('overflow');
            }
            
            return () => {
            if (areaRef.current) {
                areaRef.current.style.removeProperty('overflow');
            }
        };
    }, [isModalOpen]);

    if (typeof window === 'undefined') return null;

    return (
        <AnimatePresence>
        {isModalOpen && (
            <motion.div 
            ref={modalRef}
            className={styles.page}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.3
            }}
            >
            <span className={styles.close} onClick={closeModal}>
                <Close />
            </span>
            {modalContent}
            </motion.div>
        )}
        </AnimatePresence>
    );
}