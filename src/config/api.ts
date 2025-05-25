export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:7047',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      VERIFY_MFA: '/api/auth/verify-mfa',
      SETUP_MFA: '/api/auth/setup-mfa',
      ENABLE_MFA: '/api/auth/enable-mfa',
      DISABLE_MFA: '/api/auth/disable-mfa',
      RESET_PASSWORD: '/api/auth/reset-password',
      CHANGE_PASSWORD: '/api/auth/change-password',
    },
    ORDERS: {
      BASE: '/api/order',
      USER: '/api/order/user',
      STATUS: '/api/order/status',
      ANALYTICS: '/api/Order/analytics',
      REPORT: '/api/Order/report',
    },
    USERS: {
      BASE: '/api/users',
      PROFILE: '/api/users/profile',
      PREFERENCES: '/api/User/preferences',
      REPORT: "/api/User/reports"
    },
    RESTAURANTS: {
      BASE: '/api/restaurants',
      MENU: '/api/restaurants/menu',
      MENU_BY_RESTAURANT: (id: string) => `/api/Menu/restaurant/${id}`,
    },
    FEEDBACK: {
      BASE: '/api/feedback',
    },
    ANALYTICS: {
      BASE: '/api/analytics',
      DASHBOARD: '/api/analytics/dashboard',
      AUDIT_LOGS: '/api/analytics/audit-logs',
      EXPORT: '/api/analytics/export',
      PERFORMANCE: '/api/analytics/performance',
      USER_ACTIVITY: '/api/analytics/user-activity',
      SYSTEM_HEALTH: '/api/analytics/system-health',
    },
    FILES: {
      BASE: '/api/files',
      UPLOAD: '/api/files/upload',
      DOWNLOAD: '/api/files/download',
      DELETE: '/api/files/delete',
      SECURE_LINK: '/api/files/secure-link',
    },
    NOTIFICATIONS: {
      BASE: '/api/notifications',
      PREFERENCES: '/api/notifications/preferences',
      MARK_READ: '/api/notifications/mark-read',
      MARK_ALL_READ: '/api/notifications/mark-all-read',
    },
    BACKUP: {
      BASE: '/api/backup',
      CREATE: '/api/backup/create',
      RESTORE: '/api/backup/restore',
      LIST: '/api/backup/list',
      DELETE: '/api/backup/delete',
    },
  },
  SIGNALR: {
    HUBS: {
      NOTIFICATIONS: '/hubs/notifications',
      ANALYTICS: '/hubs/analytics',
      ORDERS: '/hubs/orders'
    }
  },
  FILE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB from backend config
    ALLOWED_TYPES: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
  }
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 