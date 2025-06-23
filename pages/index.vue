<script setup>

const identity = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    identity.value = await useRobotIdentity()
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <div>
    <pre v-if="identity">{{ identity }}</pre>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>
