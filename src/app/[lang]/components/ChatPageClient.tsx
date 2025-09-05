// src/app/[lang]/chat/[chatId]/ChatPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import MainContent from './MainContent';
import { Message } from '../types';
import { getChatMessages, sendMessageAndStreamResponse } from '../../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface ChatPageClientProps {
  toggleSidebar?: () => void;
  dictionary: any;
  chatId: string;
}

export default function ChatPageClient({ toggleSidebar, dictionary, chatId }: ChatPageClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const { user } = useAuth();
  const t = dictionary.chat;

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId && user) {
        setIsLoadingHistory(true);
        try {
          const messagesFromApi = await getChatMessages(chatId);
          
          const formattedMessages = messagesFromApi.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            sender: msg.is_ai_response ? 'bot' : 'user',
            timestamp: new Date(msg.created_at),
          }));
          setMessages(formattedMessages);
        } catch (error: any) {
          toast.error(error.message || "Failed to load chat history.");
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };
    fetchMessages();
  }, [chatId, user]);

  const handleSendMessage = async () => {
    const content = inputMessage.trim();
    if (!content || isLoading) return;

    setIsLoading(true);
    setInputMessage('');

    const userMessage: Message = { 
      id: `temp-user-${Date.now()}`,
      content, 
      sender: 'user', 
      timestamp: new Date()
    };
    
    const aiTypingMessage: Message = {
      id: `temp-ai-${Date.now()}`,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage, aiTypingMessage]);

    await sendMessageAndStreamResponse(
      chatId,
      { message: content },
      (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiTypingMessage.id 
            ? { ...msg, content: msg.content + chunk } 
            : msg
        ));
      },
      (error) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiTypingMessage.id 
            ? { ...msg, content: `**Error:** ${error.message}` } 
            : msg
        ));
        setIsLoading(false);
      }
    );

    setIsLoading(false);
    // ملاحظة: لا نقوم بإعادة جلب الرسائل هنا لأن الواجهة الخلفية تحفظها بعد انتهاء التدفق
  };

  return (
    <MainContent
      dictionary={dictionary}
      messages={messages}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      attachedFiles={[]}
      setAttachedFiles={() => {}}
      handleSendMessage={handleSendMessage}
      handleRegenerate={() => {}} // يمكنك إضافة هذا المنطق لاحقًا
      isLoading={isLoading || isLoadingHistory}
      toggleSidebar={toggleSidebar || (() => {})}
    />
  );
}