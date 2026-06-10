import axios from "axios"

export const useApi = () => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiUrl,
    headers: {
      Accept: "application/json",
    },
  })

  const get = async (
    url: string,
    params?: any,
  ) => {
    const response = await api.get(
      url,
      {
        params,
      },
    )

    return response.data
  }

  const post = async (
    url: string,
    data?: any,
  ) => {
    const response = await api.post(
      url,
      data,
    )

    return response.data
  }

  const put = async (
    url: string,
    data?: any,
  ) => {
    const response = await api.put(
      url,
      data,
    )

    return response.data
  }

  const del = async (
    url: string,
  ) => {
    const response =
      await api.delete(url)

    return response.data
  }

  return {
    get,
    post,
    put,
    delete: del,
  }
}