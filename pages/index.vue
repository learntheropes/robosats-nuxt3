<script setup>

const identity = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    identity.value = await useRobotIdentity()
    console.log('Authorization header:', identity.value.authorization)
  } catch (err) {
    error.value = err.message
    console.error('Error generating identity:', err)
  }
})
</script>

<template>
  <div>
    <pre v-if="identity">{{ identity }}</pre>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>
