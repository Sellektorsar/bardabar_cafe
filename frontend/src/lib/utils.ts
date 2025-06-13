import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect, useCallback } from 'react';
import { toast } from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Типы для уведомлений
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

// Утилита для отображения уведомлений
export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    dismiss: toast.dismiss,
  };
}

// Утилита для кодирования файла в base64
export function encodeFileAsBase64DataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Форматирование даты
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Форматирование цены
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
}

// Добавление анимации появления элементов
export const staggeredAnimation = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1.0],
    delay: index * 0.1,
  },
});

// Добавление анимации для списков
export const staggeredContainerAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

// Добавление анимации для элементов списка
export const staggeredItemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Добавление анимации для модальных окон
export const modalAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

// Типы для аутентификации
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  userId: string | null;
  user: any | null; // можно расширить под ваши нужды
}

// Хук для аутентификации (useAuth)
export const useAuth = (options?: { required?: boolean }) => {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    userId: null,
    user: null
  });

  // Функция для входа
  const signIn = useCallback(async (credentials?: { email: string; password: string }) => {
    try {
      // Здесь будет ваша логика входа
      // Например, запрос к API:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();
      
      // Временная заглушка для примера:
      setAuthState({
        status: 'authenticated',
        userId: '123',
        user: { email: credentials?.email || 'user@example.com' }
      });
    } catch (error) {
      console.error('Ошибка входа:', error);
      setAuthState({
        status: 'unauthenticated',
        userId: null,
        user: null
      });
    }
  }, []);

  // Функция для выхода
  const signOut = useCallback(async () => {
    try {
      // Здесь будет ваша логика выхода
      // Например, запрос к API:
      // await fetch('/api/auth/logout', { method: 'POST' });
      
      setAuthState({
        status: 'unauthenticated',
        userId: null,
        user: null
      });
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  }, []);

  // Проверка аутентификации при монтировании компонента
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Здесь будет ваша логика проверки аутентификации
        // Например, проверка токена в localStorage или запрос к API
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Временная заглушка для примера:
          setAuthState({
            status: 'authenticated',
            userId: '123',
            user: { email: 'user@example.com' }
          });
        } else {
          setAuthState({
            status: 'unauthenticated',
            userId: null,
            user: null
          });
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        setAuthState({
          status: 'unauthenticated',
          userId: null,
          user: null
        });
      }
    };

    checkAuth();
  }, []);

  return {
    ...authState,
    signIn,
    signOut
  };
};

// Функция для получения базового URL
export const getBaseUrl = () => {
  // В браузере
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // На сервере (можно настроить под ваши нужды)
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

// Хук для работы с данными в реальном времени (useRealtimeStore)
export const useRealtimeStore = <T>(channelId: string, initialData: T) => {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    // Здесь будет ваша логика подключения к WebSocket или другому источнику данных
    // Например:
    // const ws = new WebSocket(`ws://your-server/${channelId}`);
    // ws.onmessage = (event) => {
    //   setData(JSON.parse(event.data));
    // };
    // return () => ws.close();
    
    console.log(`Подключение к каналу ${channelId} (заглушка)`);
  }, [channelId]);

  return [data, setData] as const;
};

// Хук для мутаций в реальном времени (useRealtimeMutation)
export const useRealtimeMutation = <T>(
  mutationFn: (data: T) => Promise<void>,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void }
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: T) => {
    setIsLoading(true);
    setError(null);
    try {
      await mutationFn(data);
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, options]);

  return { mutate, isLoading, error };
};

// Функция для подключения к хранилищу в реальном времени
export const connectToRealtimeStore = async <T>({
  channelId,
  initialData,
  onUpdate
}: {
  channelId: string;
  initialData: T;
  onUpdate: (data: T) => void;
}) => {
  // Здесь будет ваша логика подключения
  // Например, создание WebSocket соединения
  
  console.log(`Подключение к каналу ${channelId} (заглушка)`);
  
  // Возвращаем функцию для отключения
  return {
    disconnect: () => {
      console.log(`Отключение от канала ${channelId} (заглушка)`);
    }
  };
};
