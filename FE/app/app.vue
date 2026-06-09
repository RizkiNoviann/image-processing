<script setup lang="ts">
const selectedFile = ref<File | null>(null)

const job = ref({
  id: "JOB-20260806-001",
  status: "processing",
  downloadUrl: "#",
})

const handleFileSelected = (file: File) => {
  selectedFile.value = file
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

      <JobStatus
        v-if="selectedFile"
        :job-id="job.id"
        :status="job.status"
        :download-url="job.downloadUrl"
      />
    </div>
  </div>
</template>
