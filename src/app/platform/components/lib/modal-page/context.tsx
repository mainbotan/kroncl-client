'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ModalPageContextType {
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalPageContext = createContext<ModalPageContextType | undefined>(undefined);

export function ModalPageProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  return (
    <ModalPageContext.Provider value={{ isModalOpen, modalContent, openModal, closeModal }}>
      {children}
    </ModalPageContext.Provider>
  );
}

export function useModalPage() {
  const context = useContext(ModalPageContext);
  if (!context) {
    throw new Error('useModalPage must be used within ModalPageProvider');
  }
  return context;
}