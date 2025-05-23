// Base URL for all API calls
export const API_BASE_URL = 'https://pizza-delivery-xgd1.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  users: {
    register: `${API_BASE_URL}/users/register`,
    login: `${API_BASE_URL}/users/login`,
  },
  orders: {
    create: `${API_BASE_URL}/orders`,
    list: `${API_BASE_URL}/orders`,
  }
};
