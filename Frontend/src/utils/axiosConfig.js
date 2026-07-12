import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// 🔐 Request Interceptor - Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// 🔐 Response Interceptor - Handle common errors globally
api.interceptors.response.use(
  (response) => {
    // Return response as-is for successful requests
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error - Server might be down");
      error.message = "Network error. Please check your connection.";
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - Token expired or invalid
        console.error("Unauthorized access - Token may be expired");
        
        // Clear localStorage and redirect to login
        if (window.location.pathname !== "/login" && !window.location.pathname.includes("/admin")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          // Optional: Show message before redirect
          if (window.location.pathname !== "/") {
            window.location.href = "/login";
          }
        }
        break;
        
      case 403:
        console.error("Forbidden - Insufficient permissions");
        break;
        
      case 404:
        console.error("Resource not found");
        break;
        
      case 500:
        console.error("Server error - Please try again later");
        break;
        
      default:
        console.error(`API Error (${status}):`, data?.message || "Unknown error");
    }

    // Pass the error to the component for handling
    return Promise.reject(error);
  }
);

// Helper method to handle file uploads
export const uploadFile = async (url, file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
  
  return response;
};

// Helper method for GET requests with caching option
export const getWithCache = async (url, useCache = false) => {
  if (useCache) {
    const cached = sessionStorage.getItem(`cache_${url}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache expires after 5 minutes
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return { data };
      }
    }
  }
  
  const response = await api.get(url);
  
  if (useCache) {
    sessionStorage.setItem(`cache_${url}`, JSON.stringify({
      data: response.data,
      timestamp: Date.now()
    }));
  }
  
  return response;
};

// Helper to clear cache
export const clearCache = (url = null) => {
  if (url) {
    sessionStorage.removeItem(`cache_${url}`);
  } else {
    // Clear all cache
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith("cache_")) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export default api;