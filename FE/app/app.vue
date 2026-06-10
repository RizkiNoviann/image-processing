<script setup lang="ts">
const selectedFile = ref<File | null>(null)
const jobs = useJobs()

const job = ref({
  id: "",
  status: "",
  downloadUrl: "",
})

const loading = ref(false)
const uploadError = ref("")

const handleFileSelected = async (file: File) => {
  selectedFile.value = file
  loading.value = true
  uploadError.value = ""

  // reset job state agar komponen JobStatus di-remount
  job.value = { id: "", status: "", downloadUrl: "" }

  try {
    const response = await jobs.upload(file)
    job.value.id = response.jobId
    job.value.status = response.status
    job.value.downloadUrl = jobs.download(response.jobId)
  } catch (error: any) {
    uploadError.value =
      error?.response?.data?.message ?? "Gagal mengupload gambar."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="max-w-3xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold text-center mb-2">Image Processing App</h1>

      <p class="text-center text-slate-600 mb-8">
        Upload gambar dan optimasi secara asynchronous
      </p>

      <UploadForm @file-selected="handleFileSelected" />

      <div v-if="loading" class="text-center mt-6 text-slate-600">
        Uploading...
      </div>

      <div v-if="uploadError" class="text-center mt-6 text-red-500">
        {{ uploadError }}
      </div>

      <!-- :key memastikan JobStatus di-remount setiap upload baru -->
      <JobStatus
        v-if="job.id"
        :key="job.id"
        :job-id="job.id"
        :initial-status="job.status"
        :download-url="job.downloadUrl"
      />
    </div>
  </div>
</template>
