import { encodeFileAsBase64DataURL } from '../lib/utils';

const API_URL = 'http://localhost:3001/api';

// Типы для API
type MenuCategory = {
  id: string;
  name: string;
  order: number;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  articleCode?: string | null;
  categoryId: string;
  category?: MenuCategory;
};

type Event = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  date: string;
};

type News = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
};

type ContactRequest = {
  id: string;
  name: string;
  phone: string;
  message?: string;
  type: string;
  createdAt: string;
};

type Staff = {
  id: string;
  name: string;
  position: string;
  description?: string | null;
  imageUrl?: string | null;
  order: number;
};

type AboutContent = {
  id: string;
  title: string;
  content: string;
  advantages: Array<{ title: string; description: string }>;
};

// Общая функция для запросов
async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(error.message || `Ошибка ${response.status}`);
  }

  return response.json();
}

// API клиент
export const apiClient = {
  // Админ
  getAdminStatus: () => fetchApi<{ isAdmin: boolean }>('/admin/status'),
  
  verifyAdminPassword: (data: { password: string }) =>
    fetchApi<{ success: boolean }>('/admin/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  setAdminPassword: (data: { password: string }) =>
    fetchApi('/admin/password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Категории меню
  getMenuCategories: () => fetchApi<MenuCategory[]>('/menu/categories'),
  
  createMenuCategory: (data: { name: string; order?: number }) =>
    fetchApi<MenuCategory>('/menu/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateMenuCategory: (data: { id: string; name?: string; order?: number }) =>
    fetchApi<MenuCategory>(`/menu/categories/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: data.name, order: data.order }),
    }),
  
  deleteMenuCategory: (id: string) =>
    fetchApi(`/menu/categories/${id}`, {
      method: 'DELETE',
    }),

  // Элементы меню
  getMenuItems: (categoryId?: string) =>
    fetchApi<MenuItem[]>(`/menu/items${categoryId ? `?categoryId=${categoryId}` : ''}`),
  
  createMenuItem: async (data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    articleCode?: string;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    return fetchApi<MenuItem>('/menu/items', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        imageBase64,
      }),
    });
  },
  
  updateMenuItem: async (data: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    articleCode?: string;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    const { id, ...rest } = data;
    return fetchApi<MenuItem>(`/menu/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...rest,
        imageBase64,
      }),
    });
  },
  
  deleteMenuItem: (id: string) =>
    fetchApi(`/menu/items/${id}`, {
      method: 'DELETE',
    }),

  // События
  getEvents: () => fetchApi<Event[]>('/events'),
  
  createEvent: async (data: {
    title: string;
    description?: string;
    date: string;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    return fetchApi<Event>('/events', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        imageBase64,
      }),
    });
  },
  
  updateEvent: async (data: {
    id: string;
    title?: string;
    description?: string;
    date?: string;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    const { id, ...rest } = data;
    return fetchApi<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...rest,
        imageBase64,
      }),
    });
  },
  
  deleteEvent: (id: string) =>
    fetchApi(`/events/${id}`, {
      method: 'DELETE',
    }),

  // Новости
  getNews: () => fetchApi<News[]>('/news'),
  
  createNews: async (data: {
    title: string;
    content: string;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    return fetchApi<News>('/news', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        imageBase64,
      }),
    });
  },
  
  updateNews: async (data: {
    id: string;
    title?: string;
    content?: string;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    const { id, ...rest } = data;
    return fetchApi<News>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...rest,
        imageBase64,
      }),
    });
  },
  
  deleteNews: (id: string) =>
    fetchApi(`/news/${id}`, {
      method: 'DELETE',
    }),

  // Контакты
  submitContactRequest: (data: {
    name: string;
    phone: string;
    message?: string;
    type: string;
  }) =>
    fetchApi<ContactRequest>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getContactRequests: () => fetchApi<ContactRequest[]>('/contacts'),

  // Персонал
  getStaffMembers: () => fetchApi<Staff[]>('/staff'),
  
  createStaffMember: async (data: {
    name: string;
    position: string;
    description?: string;
    order?: number;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    return fetchApi<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        imageBase64,
      }),
    });
  },
  
  updateStaffMember: async (data: {
    id: string;
    name?: string;
    position?: string;
    description?: string;
    order?: number;
    imageFile?: File | null;
  }) => {
    let imageBase64;
    if (data.imageFile) {
      imageBase64 = await encodeFileAsBase64DataURL(data.imageFile);
    }

    const { id, ...rest } = data;
    return fetchApi<Staff>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...rest,
        imageBase64,
      }),
    });
  },
  
  deleteStaffMember: (id: string) =>
    fetchApi(`/staff/${id}`, {
      method: 'DELETE',
    }),

  // О нас
  getAboutContent: () => fetchApi<AboutContent>('/about'),
  
  updateAboutContent: (data: {
    title?: string;
    content: string;
    advantages: Array<{ title: string; description: string }>;
  }) =>
    fetchApi<AboutContent>('/about', {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        advantages: JSON.stringify(data.advantages),
      }),
    }),

  // Служебные методы для разработки
  seedInitialData: () => fetchApi('/_seed', { method: 'POST' }),
  resetAdminPassword: () => fetchApi('/_reset-admin', { method: 'POST' }),
  makeUserAdmin: () => fetchApi('/_make-admin', { method: 'POST' }),
}; 