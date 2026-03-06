'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SideContentContextType {
  content: React.ReactNode;
  isOpen: boolean;
  openSideContent: (content: React.ReactNode) => void;
  closeSideContent: () => void;
}

const SideContentContext = createContext<SideContentContextType | undefined>(undefined);

const SIDE_CONTENT_STORAGE_KEY = 'platform-side-content';

export function SideContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Загружаем состояние из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(SIDE_CONTENT_STORAGE_KEY);
    if (saved) {
      try {
        const { isOpen: savedIsOpen } = JSON.parse(saved);
        setIsOpen(savedIsOpen);
      } catch (e) {
        console.error('Failed to parse side content state', e);
      }
    }
  }, []);

  // Сохраняем состояние в localStorage
  useEffect(() => {
    localStorage.setItem(SIDE_CONTENT_STORAGE_KEY, JSON.stringify({ isOpen }));
  }, [isOpen]);

  const openSideContent = (newContent: React.ReactNode) => {
    setContent(newContent);
    setIsOpen(true);
  };

  const closeSideContent = () => {
    setIsOpen(false);
    // Очищаем контент после закрытия (с задержкой для анимации)
    setTimeout(() => setContent(null), 300);
  };

  return (
    <SideContentContext.Provider value={{ content, isOpen, openSideContent, closeSideContent }}>
      {children}
    </SideContentContext.Provider>
  );
}

export function useSideContent() {
  const context = useContext(SideContentContext);
  if (!context) {
    throw new Error('useSideContent must be used within SideContentProvider');
  }
  return context;
}