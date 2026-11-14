const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper for authorized headers
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('adminToken');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Generic fetch wrapper with error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Base URL helper for images and files
  getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  },

  // Auth APIs
  auth: {
    login: (credentials) =>
      request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }),
    getMe: () =>
      request('/api/auth/me', {
        headers: getAuthHeaders(),
      }),
    updatePassword: (payload) =>
      request('/api/auth/update-password', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }),
  },

  // Profile APIs
  profile: {
    get: () => request('/api/profile'),
    update: (data) =>
      request('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    uploadImage: (formData) =>
      request('/api/profile/upload-image', {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      }),
  },

  // Skills APIs
  skills: {
    getAll: () => request('/api/skills'),
    create: (data) =>
      request('/api/skills', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/skills/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
  },

  // Projects APIs
  projects: {
    getAll: () => request('/api/projects'),
    getById: (id) => request(`/api/projects/${id}`),
    create: (data) =>
      request('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
    uploadImage: (formData) =>
      request('/api/projects/upload-image', {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      }),
  },

  // Education APIs
  education: {
    getAll: () => request('/api/education'),
    create: (data) =>
      request('/api/education', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/education/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/education/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
  },

  // Experience / Internships APIs
  experience: {
    getAll: () => request('/api/experience'),
    create: (data) =>
      request('/api/experience', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/experience/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/experience/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
  },

  // Certifications APIs
  certifications: {
    getAll: () => request('/api/certifications'),
    create: (data) =>
      request('/api/certifications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/certifications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/certifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
    uploadImage: (formData) =>
      request('/api/certifications/upload-image', {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      }),
  },

  // Contact Messages APIs
  messages: {
    send: (data) =>
      request('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    getAll: () =>
      request('/api/messages', {
        headers: getAuthHeaders(),
      }),
    getById: (id) =>
      request(`/api/messages/${id}`, {
        headers: getAuthHeaders(),
      }),
    toggleRead: (id, isRead) =>
      request(`/api/messages/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isRead }),
      }),
    delete: (id) =>
      request(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
  },

  // Resume APIs
  resume: {
    getActive: () => request('/api/resume'),
    upload: (formData) =>
      request('/api/resume/upload', {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      }),
    delete: (id) =>
      request(`/api/resume/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
    getDownloadUrl: () => `${API_BASE_URL}/api/resume/download`,
  },

  // Dashboard Stats APIs
  stats: {
    get: () =>
      request('/api/stats', {
        headers: getAuthHeaders(),
      }),
  },
};

export default api;
