export default defineEventHandler(async (event) => {
  const authorization = await getRequestHeader(event, 'X-Robosats-Authorization')
  const { id } = getQuery(event)

  return await robosatsRequest({
    authorization,
    path: '/api/order/',
    query: { order_id: id }
  })
})