import axios from 'axios'

let resolvedBase = 'http://localhost:3001/api/v1'

export function setApiBase(base: string) {
  if (base) resolvedBase = base
}

const api = axios.create()

api.interceptors.request.use((config) => {
  if (!config.baseURL) config.baseURL = resolvedBase
  return config
})

export default api
