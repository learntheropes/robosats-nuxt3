export default defineEventHandler(async (event) => {
  const authorization = await getRequestHeader(event, 'x-robosats-authorization')

  return await robosatsRequest({
    authorization,
    path: '/api/robot/',
  })
})
