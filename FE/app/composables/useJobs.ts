import type {
  UploadResponse,
  JobStatusResponse,
} from "~/types/job"

export const useJobs = () => {
  const api = useApi()

  const upload = async (
    file: File,
  ): Promise<UploadResponse> => {
    const formData =
      new FormData()

    formData.append(
      "image",
      file,
    )

    return api.post(
      "/jobs/upload",
      formData,
    )
  }

  const getStatus =
    async (
      id: string,
    ): Promise<JobStatusResponse> => {
      return api.get(
        `/jobs/${id}`,
      )
    }

  const download = (
    id: string,
  ) => {
    const config =
      useRuntimeConfig()

    return `${config.public.apiUrl}/jobs/${id}/download`
  }

  return {
    upload,
    getStatus,
    download,
  }
}