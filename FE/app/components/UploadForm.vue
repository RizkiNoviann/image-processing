<script setup lang="ts">
const emit = defineEmits<{
  fileSelected: [file: File]
}>()

const preview = ref("")
const fileName = ref("")

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (!target.files?.length) return

  const file = target.files[0]

  fileName.value = file.name
  preview.value = URL.createObjectURL(file)

  emit("fileSelected", file)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <h2 class="text-xl font-semibold mb-4">Upload Image</h2>

    <label
      class="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
    >
      <input
        type="file"
        class="hidden"
        accept=".jpg,.jpeg,.png,.webp"
        @change="handleChange"
      />

      <span class="text-slate-600"> Klik untuk memilih gambar </span>

      <span class="text-sm text-slate-400 mt-2">
        JPG, PNG, WEBP (Max 20MB)
      </span>
    </label>

    <div v-if="preview" class="mt-6">
      <img :src="preview" class="rounded-xl max-h-72 mx-auto" />

      <p class="text-center mt-3 text-slate-600">
        {{ fileName }}
      </p>
    </div>
  </div>
</template>
