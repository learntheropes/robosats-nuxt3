export default defineEventHandler(async (event) => {
  const { authorization } = await readBody(event)

  return await robosatsRequest({
    authorization,
    path: '/api/robot/',
  })
})
