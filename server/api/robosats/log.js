export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const req = event.node.req

  // 🔍 Log what you receive from client
  console.log('AUTH HEADER FROM CLIENT:')
  console.log(req.headers['authorization']) // likely undefined from $fetch
  console.log('BODY AUTHORIZATION:')
  console.log(body.authorization) // this is what you're sending

  // Optionally forward it to RoboSats using `got` or similar here
})
