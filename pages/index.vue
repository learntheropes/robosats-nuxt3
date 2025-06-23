<script setup>
const limits = ref(null)
const identity = ref(null)
const offer = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
  const { authorization } = await useRobotIdentity()

  limits.value = await $fetch('/api/robosats/limits')

  identity.value = await $fetch('/api/robosats/robot', {
    method: 'POST',
    body: { authorization },
    headers: { 'Content-Type': 'application/json' },
  })

  offer.value = await $fetch('/api/robosats/offer', {
    method: 'POST',
    body: { 
      authorization, 
      amount: 50, 
      currency: 'EUR', 
      paymentMethods: 'Revolut' 
    },
    headers: { 'Content-Type': 'application/json' },
  })

  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <div>
    <pre v-if="limits">{{ limits }}</pre>
    <pre v-if="identity">{{ identity }}</pre>
    <pre v-if="offer">{{ offer }}</pre>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>
