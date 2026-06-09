<script setup lang="ts">
defineProps<{
  url: string
}>()
</script>

<template>
  <a
    :href="url"
    class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
  >
    Download Processed Image
  </a>
</template>
