<template>
  <div class="compressor">
    <h2>Image Compressor (Canvas + Nuxt)</h2>

    <input type="file" accept="image/*" @change="onFileChange" />

    <div v-if="originalSize" class="info">
      <p>Original size: {{ originalSize }} KB</p>
    </div>

    <label>
      Quality: {{ quality }}
      <input type="range" min="0.1" max="1" step="0.1" v-model.number="quality" />
    </label>

    <button @click="compressImage" :disabled="!file">Compress</button>

    <div v-if="compressedUrl" class="result">
      <p>Compressed size: {{ compressedSize }} KB</p>
      <img :src="compressedUrl" alt="compressed preview" />
      <a :href="compressedUrl" download="compressed.jpg">Download</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const file = ref(null)
const quality = ref(0.7)
const compressedUrl = ref(null)
const originalSize = ref(null)
const compressedSize = ref(null)

const onFileChange = (e) => {
  file.value = e.target.files[0]
  if (file.value) {
    originalSize.value = (file.value.size / 1024).toFixed(2)
  }
}

const compressImage = () => {
  if (!file.value) return

  const img = new Image()
  img.src = URL.createObjectURL(file.value)

  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const scale = 0.7 // resize ratio
    canvas.width = img.width * scale
    canvas.height = img.height * scale

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        compressedUrl.value = URL.createObjectURL(blob)
        compressedSize.value = (blob.size / 1024).toFixed(2)
      },
      'image/jpeg',
      quality.value
    )
  }
}
</script>

<style scoped>
.compressor {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

img {
  max-width: 100%;
  margin-top: 10px;
}

button {
  margin-top: 10px;
}
</style>
