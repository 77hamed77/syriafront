// src/services/api.ts 
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const handleResponse = async (response: Response) => {
  if (response.status === 204) return;
  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message || data.detail || 'An unknown error occurred.';
    throw new Error(errorMessage);
  }
  return data;
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await fetch(`${API_BASE_URL}/api/sessions/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await handleResponse(response);
  // --- تعديل مهم: refreshToken الآن فقط يرجع التوكن الجديد ---
  // AuthContext سيكون مسؤولاً عن حفظه
  localStorage.setItem('accessToken', data.access_token);
  if (data.refresh_token) {
    localStorage.setItem('refreshToken', data.refresh_token);
  }
  return data.access_token;
};

const getValidAccessToken = async () => {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const isExpired = Date.now() >= decoded.exp * 1000 - 60000;
    if (isExpired) {
      token = await refreshToken();
    }
    return token;
  } catch (error) {
    try {
      token = await refreshToken();
      return token;
    } catch (refreshError) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  }
};

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
// AUTHENTICATION
// ========================================================================

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  // --- تعديل مهم: loginUser الآن فقط ترجع البيانات ---
  // لا تقوم بحفظ أي شيء في localStorage
  return handleResponse(response);
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const getCurrentUser = () => apiFetch('/users/me/profile/');

// ========================================================================
// USER MANAGEMENT
// ========================================================================

export const getUserProfile = () => apiFetch('/users/me/profile/');
export const updateUserProfile = (profileData: { first_name?; last_name?; phone_number?; profile_picture?}) => 
  apiFetch('/users/me/profile/', { method: 'PATCH', body: JSON.stringify(profileData) });

export const getUserSettings = () => apiFetch('/users/me/settings/');
export const updateUserSettings = (settingsData) => apiFetch('/users/me/settings/', { method: 'PUT', body: JSON.stringify(settingsData) });

export const changePassword = (passwordData: { current_password; new_password; confirm_password }) => 
  apiFetch('/users/me/change-password/', { method: 'PUT', body: JSON.stringify(passwordData) });

export const deleteAccount = () => 
  apiFetch('/users/me/delete/', { method: 'DELETE' });
// ========================================================================
// CHAT
// ========================================================================

export const getChats = () => apiFetch('/chat/');
export const createChat = (chatData) => apiFetch('/chat/', { method: 'POST', body: JSON.stringify(chatData) });
export const sendMessage = (chatId, messageData) => apiFetch(`/chat/${chatId}/messages/`, { method: 'POST', body: JSON.stringify(messageData) });

// --- دالة جديدة لاستقبال الرد المتدفق ---
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
headers['Authorization'] = Bearer ${token};
}
const response = await fetch(`${API_BASE_URL}/api/chat/${chatId}/messages/`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ message: messageData.message }),
});

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const reader = response.body?.getReader();
if (!reader) {
  throw new Error("Failed to get response reader.");
}

const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  onChunk(decoder.decode(value, { stream: true }));
}
} catch (error: any) {
console.error("Streaming failed:", error);
onError(error);
}
};

export const getChatMessages = (chatId) => apiFetch(`/chat/${chatId}/messages/`);
export const addFeedbackToMessage = (messageId, feedbackData) => apiFetch(`/chat/messages/${messageId}/feedback/`, { method: 'POST', body: JSON.stringify(feedbackData) });
export const clearChatHistory = () => 
  apiFetch('/chat/clear-history/', { method: 'POST' });

export const exportUserData = () => 
  apiFetch('/users/me/export/', { method: 'POST' });


// ========================================================================
// ADMIN PANEL
// ========================================================================

export const adminGetAllUsers = () => 
  apiFetch('/admin/users/');

export const adminDeleteUser = (userId: number) => 
  apiFetch(`/admin/users/${userId}/`, { method: 'DELETE' });