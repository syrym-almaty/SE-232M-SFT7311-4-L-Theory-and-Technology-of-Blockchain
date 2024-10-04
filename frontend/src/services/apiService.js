// frontend/services/apiService.js
export const fetchExampleData = async () => {
    const response = await fetch('/api/example');
    const data = await response.json();
    return data;
  };
  