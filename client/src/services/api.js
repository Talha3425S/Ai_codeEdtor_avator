import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

const postCode = async (path, code) => {
  const response = await api.post(path, { code })
  return response.data
}

export const explainCode = (code) => postCode('/ai/explain', code)
export const fixCode = (code) => postCode('/ai/fix', code)
export const generateCode = (code) => postCode('/ai/generate', code)
export const scanSecurity = (code) => postCode('/security/scan', code)

