// src/services/api.ts
import { jwtDecode } from 'jwt-decode';

// ========================================================================
// 1. الإعدادات الأساسية والأنواع (Types)
// ========================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// تعريف أنواع البيانات لتحسين الكود
interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  phone_number?: string;
  date_joined: string;
  conversations_count: number;
  active_days: number;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  email_notifications: boolean;
}

interface Chat {
  id: string;
  title: string;
}

// ========================================================================
// 2. الدوال المساعدة لإدارة الطلبات والتوكنات
// ========================================================================

const handleResponse = async (response: Response) => {
  if (response.status === 204) return; // No Content

  const data = await response.json();
  if (!response.ok) {
    // معالجة رسائل الخطأ المختلفة من Django REST Framework
    const errorMessage = data.detail || data.message || data.error || JSON.stringify(data);
    throw new Error(errorMessage);
  }
  return data;
};

const refreshToken = async (): Promise<string> => {
  const localRefreshToken = localStorage.getItem('refreshToken');
  if (!localRefreshToken) throw new Error("No refresh token available");

  const response = await fetch(`${API_BASE_URL}/api/sessions/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: localRefreshToken }), // Django يتوقع 'refresh'
  });

  const data = await handleResponse(response);
  
  // الواجهة الخلفية ترجع 'access'
  localStorage.setItem('accessToken', data.access);
  
  // قد ترجع الواجهة الخلفية refresh token جديدًا أيضًا
  if (data.refresh) {
    localStorage.setItem('refreshToken', data.refresh);
  }
  
  return data.access;
};

const getValidAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  let token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    // التحقق قبل دقيقة واحدة من انتهاء الصلاحية
    const isExpired = Date.now() >= decoded.exp * 1000 - 60000; 

    if (isExpired) {
      console.log("Access token expired, refreshing...");
      token = await refreshToken();
    }
    return token;
  } catch (error) {
    console.error("Invalid token, attempting refresh:", error);
    try {
      token = await refreshToken();
      return token;
    } catch (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  }
};

// Interceptor: دالة fetch مخصصة
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getValidAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}/api${url}`;
  const response = await fetch(fullUrl, { ...options, headers });
  return handleResponse(response);
};

// ========================================================================
// 3. نقاط النهاية (API Endpoints)
// ========================================================================

// --- AUTHENTICATION ---
export const loginUser = (credentials: object) => 
  fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(handleResponse);

export const registerUser = (userData: object) => 
  fetch(`${API_BASE_URL}/api/users/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(handleResponse);

export const getCurrentUser = (): Promise<UserProfile> => 
  apiFetch('/users/me/profile/');

// --- USER MANAGEMENT ---
export const getUserProfile = (): Promise<UserProfile> => 
  apiFetch('/users/me/profile/');

export const updateUserProfile = (profileData: Partial<UserProfile>) => 
  apiFetch('/users/me/profile/', { method: 'PATCH', body: JSON.stringify(profileData) });

export const getUserSettings = (): Promise<UserSettings> => 
  apiFetch('/users/me/settings/');

export const updateUserSettings = (settingsData: UserSettings) => 
  apiFetch('/users/me/settings/', { method: 'PUT', body: JSON.stringify(settingsData) });

export const changePassword = (passwordData: object) => 
  apiFetch('/users/me/change-password/', { method: 'PUT', body: JSON.stringify(passwordData) });

export const deleteAccount = () => 
  apiFetch('/users/me/delete/', { method: 'DELETE' });

// --- CHAT ---
export const getChats = (): Promise<Chat[]> => 
  apiFetch('/chat/');

export const createChat = (chatData: { title: string }): Promise<Chat> => 
  apiFetch('/chat/', { method: 'POST', body: JSON.stringify(chatData) });

export const getChatMessages = (chatId: string) => 
  apiFetch(`/chat/${chatId}/messages/`);

export const addFeedbackToMessage = (messageId: string, feedbackData: object) => 
  apiFetch(`/chat/messages/${messageId}/feedback/`, { method: 'POST', body: JSON.stringify(feedbackData) });

// --- DATA MANAGEMENT ---
export const clearChatHistory = () => 
  apiFetch('/chat/clear-history/', { method: 'POST' });

export const exportUserData = () => 
  apiFetch('/users/me/export/', { method: 'POST' });

// --- STREAMING ---
export const sendMessageAndStreamResponse = async (
  chatId: string,
  messageData: { message: string },
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void
) => {
  try {
    const token = await getValidAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/${chatId}/messages/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: messageData.message }),
    });

    if (!response.ok || !response.body) {
      // محاولة قراءة الخطأ كـ JSON أولاً
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData));
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  } catch (error: any) {
    console.error("Streaming failed:", error);
    onError(error);
  }
};

// --- ADMIN PANEL ---
export const adminGetAllUsers = () => 
  apiFetch('/admin/users/');

export const adminDeleteUser = (userId: number) => 
  apiFetch(`/admin/users/${userId}/`, { method: 'DELETE' });