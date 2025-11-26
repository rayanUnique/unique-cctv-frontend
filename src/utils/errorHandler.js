// Error handling utility for API calls
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return data || 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return data || 'Requested resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data || `Error: ${status}`;
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Network error: Please check your internet connection and try again.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

export const isNetworkError = (error) => {
  return !error.response;
};

export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};

export const getErrorMessage = (error, defaultMessage = 'Something went wrong') => {
  if (typeof error === 'string') return error;
  return handleApiError(error) || defaultMessage;
};