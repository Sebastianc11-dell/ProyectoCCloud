import axios from "axios"

const instance = axios.create({
  baseURL: "https://pricewatch-api-1075919751225.southamerica-east1.run.app",
  headers: {
    "Content-Type": "application/json",
  },
})

let token = null

export const api = {
  setToken: (t) => {
    token = t
    if (t) {
      instance.defaults.headers.Authorization = `Bearer ${t}`
    } else {
      delete instance.defaults.headers.Authorization
    }
  },

  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config),
  patch: (url, data, config) => instance.patch(url, data, config),
}

export default instance
