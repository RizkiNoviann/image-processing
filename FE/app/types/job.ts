export interface UploadResponse {
  jobId: string
  status: string
}

export interface JobStatusResponse {
  id: string
  status: string
  processedFile: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}