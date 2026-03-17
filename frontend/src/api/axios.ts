import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api', // usa o proxy do Vite
})

// Interceptor para enviar o token automaticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default apiClient