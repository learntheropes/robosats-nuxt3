<script setup>

const { authorization } = await useRobotIdentity()

const response = await $fetch('/api/robosats/identity', {
  method: 'POST',
  body: { authorization }
})

console.log('response', response)
</script>

<template>
  <div>
    {{ response }}
  </div>
</template>
