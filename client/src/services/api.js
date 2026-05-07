import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

const postCode = async (path, code) => {
  const response = await api.post(path, { code })
  return response.data
}

export const checkAiStatus = async () => {
  const response = await api.get('/ai/status')
  return response.data
}

export const explainCode = (code) => postCode('/ai/explain', code)
export const reviewCode = (code) => postCode('/ai/review', code)
export const fixCode = (code) => postCode('/ai/fix', code)
export const optimizeCode = (code) => postCode('/ai/optimize', code)
export const generateCode = (code) => postCode('/ai/generate', code)
export const documentCode = (code) => postCode('/ai/document', code)
export const scanSecurity = (code) => postCode('/security/scan', code)
