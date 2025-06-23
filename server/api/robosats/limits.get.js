export default defineEventHandler(async (event) => {

  return await robosatsRequest({
    path: '/api/limits/',
  })
})
