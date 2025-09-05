'use client';

import React from 'react';
import { Message } from '../chat/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { addFeedbackToMessage } from '../../../../services/api';
import toast from 'react-hot-toast';

// مكونات مخصصة لعرض الشعار وأيقونة المستخدم
const SyrianEagle: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <div className={`${className} flex items-center justify-center`}>
        <img src="/images/logo.ai.svg" alt="Syrian Eagle Logo" className="w-full h-full" />
    </div>
);

const UserIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <div className={`${className} flex items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 p-2 shadow-lg`}>
        <User size={18} className="text-teal-700 dark:text-teal-300" />
    </div>
);

// المكون الرئيسي لعرض الرسالة
const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';

    const handleFeedback = async (rating: number, type: string) => {
        try {
            await addFeedbackToMessage(message.id, { rating, feedback_type: type });
            toast.success("Thank you for your feedback!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-2">
            <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && <SyrianEagle className="w-10 h-10 mt-1 flex-shrink-0" />}
                <div className={`max-w-[85%]`}>
                    <div className={`p-4 rounded-2xl ${isUser ? 'bg-gradient-to-r from-amber-500 to-green-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'}`}>
                        <ReactMarkdown
                            className="prose dark:prose-invert prose-sm max-w-none"
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={atomDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                    {!isUser && (
                        <div className="flex items-center gap-2 mt-2 px-2">
                            <button onClick={() => handleFeedback(5, 'helpful')} className="p-1 text-gray-400 hover:text-green-500 transition-colors"><ThumbsUp size={14} /></button>
                            <button onClick={() => handleFeedback(1, 'unhelpful')} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><ThumbsDown size={14} /></button>
                        </div>
                    )}
                </div>
                {isUser && <UserIcon className="w-10 h-10 mt-1 flex-shrink-0" />}
            </div>
        </div>
    );
};

export default MessageItem;