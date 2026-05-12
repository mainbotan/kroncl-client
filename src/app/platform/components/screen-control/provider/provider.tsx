'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ScreenContextType {
    isMobile: boolean;
    isDesktop: boolean;
    dismissWarning: () => void;
    shouldShowWarning: boolean;
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

const STORAGE_KEY = 'kroncl_screen_warning_dismissed';
const MOBILE_BREAKPOINT = 768;

export function ScreenProvider({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [dismissed, setDismissed] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(STORAGE_KEY) === 'true';
    });

    const checkScreen = useCallback(() => {
        const width = window.innerWidth;
        setIsMobile(width < MOBILE_BREAKPOINT);
        setIsDesktop(width >= MOBILE_BREAKPOINT);
    }, []);

    useEffect(() => {
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, [checkScreen]);

    const dismissWarning = useCallback(() => {
        setDismissed(true);
        localStorage.setItem(STORAGE_KEY, 'true');
    }, []);

    const shouldShowWarning = isMobile && !dismissed;

    return (
        <ScreenContext.Provider value={{ isMobile, isDesktop, dismissWarning, shouldShowWarning }}>
            {children}
        </ScreenContext.Provider>
    );
}

export function useScreen() {
    const context = useContext(ScreenContext);
    if (!context) {
        throw new Error('useScreen must be used within ScreenProvider');
    }
    return context;
}