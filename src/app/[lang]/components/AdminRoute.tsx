'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-500"></div>
  </div>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // إذا انتهى التحميل ولم يكن هناك مستخدم، أو كان المستخدم ليس مشرفًا
  if (!user || !user.is_staff) {
    // قم بالتوجيه إلى الصفحة الرئيسية أو صفحة 404
    router.push(`/${lang}`);
    return null;
  }

  // إذا كان المستخدم مشرفًا، اعرض المحتوى
  return <>{children}</>;
};

export default AdminRoute;