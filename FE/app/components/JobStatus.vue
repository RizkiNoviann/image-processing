<script setup lang="ts">
const props = defineProps<{
  jobId: string
  initialStatus: string
  downloadUrl: string
}>()

const jobs = useJobs()

const status = ref(props.initialStatus.toLocaleLowerCase())
const errorMessage = ref("")

const TERMINAL_STATUSES = ["completed", "failed"]

let attempt = 0
let timeoutId: ReturnType<typeof setTimeout> | null = null

const poll = async () => {
  if (TERMINAL_STATUSES.includes(status.value)) return

  try {
    const response = await jobs.getStatus(props.jobId)
    status.value = response.status.toLowerCase()
    errorMessage.value = response.errorMessage ?? ""
  } catch {}

  if (!TERMINAL_STATUSES.includes(status.value)) {
    const delay = Math.min(1000 * 2 ** attempt, 16000)
    attempt++
    timeoutId = setTimeout(poll, delay)
  }
}

onMounted(() => {
  if (!TERMINAL_STATUSES.includes(status.value)) {
    poll()
  }
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-6 mt-6">
    <h2 class="text-xl font-semibold mb-4">Job Status</h2>

    <div class="space-y-3">
      <div>
        <span class="font-medium">Job ID:</span>
        <span class="ml-2 text-slate-600">{{ jobId }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-medium">Status:</span>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-yellow-100 text-yellow-700': status === 'pending',
            'bg-blue-100 text-blue-700': status === 'processing',
            'bg-green-100 text-green-700': status === 'completed',
            'bg-red-100 text-red-700': status === 'failed',
          }"
        >
          {{ status }}
        </span>
      </div>

      <div class="pt-4">
        <DownloadButton v-if="status === 'completed'" :url="downloadUrl" />

        <p v-if="status === 'failed'" class="text-red-500">
          Gagal memproses gambar{{ errorMessage ? `: ${errorMessage}` : "." }}
        </p>
      </div>
    </div>
  </div>
</template>
