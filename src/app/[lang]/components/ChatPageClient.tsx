// src/app/[lang]/chat/[chatId]/ChatPageClient.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation'; // <-- استيراد ضروري لقراءة URL
import MainContent from '../../components/MainContent'; // <-- تم تصحيح المسار
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
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const { user } = useAuth();
  const t = dictionary.chat;

  // Ref لتجنب استدعاء useEffect مرتين في وضع التطوير
  const initialLoad = useRef(true);

  // دالة إرسال الرسائل، تم تحسينها لتقبل وسيط
  const handleSendMessage = async (messageToSend?: string) => {
    const content = (messageToSend || inputMessage).trim();
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
  };

  useEffect(() => {
    // هذا الشرط يمنع الكود من العمل مرتين في وضع التطوير
    if (initialLoad.current) {
      initialLoad.current = false;

      const fetchAndProcess = async () => {
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

            // --- منطق إرسال الرسالة الأولى ---
            const firstMessage = searchParams.get('firstMessage');
            if (firstMessage && formattedMessages.length === 0) {
              // إذا كانت المحادثة جديدة وهناك رسالة أولى، قم بإرسالها
              await handleSendMessage(firstMessage);
            }
            // --------------------------------

          } catch (error: any) {
            toast.error(error.message || "Failed to load chat history.");
          } finally {
            setIsLoadingHistory(false);
          }
        }
      };
      fetchAndProcess();
    }
  }, [chatId, user]); // الاعتماديات تبقى كما هي

  return (
    <MainContent
      dictionary={dictionary}
      messages={messages}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      attachedFiles={[]}
      setAttachedFiles={() => {}}
      handleSendMessage={() => handleSendMessage()} // استدعاء بدون وسيط عند الضغط على الزر
      handleRegenerate={() => {}}
      isLoading={isLoading || isLoadingHistory}
      toggleSidebar={toggleSidebar || (() => {})}
    />
  );
}