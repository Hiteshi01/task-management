import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('tf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tf_token')
      localStorage.removeItem('tf_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: d => api.post('/auth/register', d),
  login:    d => api.post('/auth/login', d),
}

export const projectsApi = {
  list:   ()      => api.get('/projects'),
  get:    id      => api.get(`/projects/${id}`),
  create: d       => api.post('/projects', d),
  update: (id, d) => api.put(`/projects/${id}`, d),
  delete: id      => api.delete(`/projects/${id}`),
}

export const tasksApi = {
  byProject: pid    => api.get(`/tasks/project/${pid}`),
  my:        ()     => api.get('/tasks/my'),
  get:       id     => api.get(`/tasks/${id}`),
  create:    d      => api.post('/tasks', d),
  update:    (id,d) => api.patch(`/tasks/${id}`, d),
  delete:    id     => api.delete(`/tasks/${id}`),
}

export default api
