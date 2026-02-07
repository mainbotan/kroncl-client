'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformMessage } from './message';
import { MessageConfig, MessageContextType } from './types';
import styles from './message.module.scss'; // Добавь импорт стилей

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function useMessage() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within MessageProvider');
  }
  return context;
}

interface MessageProviderProps {
  children: ReactNode;
  maxMessages?: number;
}

export function PlatformMessageProvider({ children, maxMessages = 3 }: MessageProviderProps) {
    const [messages, setMessages] = useState<MessageConfig[]>([]);

    const showMessage = useCallback((config: Omit<MessageConfig, 'id'>) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newMessage = { ...config, id };

        setMessages(prev => {
        const updated = [newMessage, ...prev];
        if (updated.length > maxMessages) {
            return updated.slice(0, maxMessages);
        }
        return updated;
        });
    }, [maxMessages]);

    const hideMessage = useCallback((id: string) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return (
        <MessageContext.Provider value={{ showMessage, hideMessage, clearMessages }}>
            {children}
            
            {/* Фиксированный контейнер вне основного потока */}
            <div className={styles.messageContainer}>
                <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            layout
                            initial={{ opacity: 0, y: 50, scale: 0.3 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0, 
                                scale: 1,
                                transition: { delay: index * 0.1 }
                            }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.5,
                                transition: { duration: 0.2 }
                            }}
                            transition={{ 
                                type: "spring", 
                                damping: 25, 
                                stiffness: 200,
                                duration: 0.4 
                            }}
                        >
                            <PlatformMessage
                                message={message}
                                onClose={() => hideMessage(message.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </MessageContext.Provider>
    );
}