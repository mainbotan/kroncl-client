'use client';

import { createContext, useContext, useState } from 'react';

interface DevSidebarContextType {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    open: () => void;
}

const DevSidebarContext = createContext<DevSidebarContextType | undefined>(undefined);

export function DevSidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(prev => !prev);
    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    return (
        <DevSidebarContext.Provider value={{ isOpen, toggle, close, open }}>
            {children}
        </DevSidebarContext.Provider>
    );
}

export function useDevSidebar() {
    const context = useContext(DevSidebarContext);
    if (context === undefined) {
        throw new Error('useDevSidebar must be used within a DevSidebarProvider');
    }
    return context;
}