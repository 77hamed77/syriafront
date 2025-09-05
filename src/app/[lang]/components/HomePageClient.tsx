'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainContent from './MainContent';
import { createChat } from '../../../../services/api'; // <-- استيراد createChat فقط
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export default function HomePageClient({ dictionary }: { dictionary: any }) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { user } = useAuth();

  // --- تم تعديل هذه الدالة بالكامل ---
  const handleStartNewChat = async () => {
    const content = inputMessage.trim();
    if (!content || isLoading) return;

    if (!user) {
      toast.error(dictionary.errors?.loginRequired || "You must be logged in to start a chat.");
      router.push(`/${lang}/login`);
      return;
    }

    setIsLoading(true);

    try {
      // الخطوة 1: إنشاء محادثة جديدة بعنوان هو بداية الرسالة
      const newChatData = await createChat({ title: content.substring(0, 40) });
      
      // الخطوة 2: توجيه المستخدم إلى صفحة المحادثة الجديدة مع تمرير الرسالة
      // صفحة ChatPageClient ستقوم بإرسال الرسالة وعرض الرد
      router.push(`/${lang}/chat/${newChatData.id}?firstMessage=${encodeURIComponent(content)}`);

    } catch (error: any) {
      toast.error(error.message || "Failed to start a new chat.");
      setIsLoading(false);
    }
  };
  // ------------------------------------

  return (
    <MainContent
      dictionary={dictionary}
      messages={[]}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      attachedFiles={[]}
      setAttachedFiles={() => {}}
      handleSendMessage={handleStartNewChat} // <-- استخدام الدالة الجديدة
      handleRegenerate={() => {}}
      isLoading={isLoading}
      toggleSidebar={() => {}}
    />
  );
}