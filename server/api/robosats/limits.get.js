export default defineEventHandler(async (event) => {
  const { currency } = getQuery(event)
  const currencyIndex = getRobosatsCurrency(currency)

  const response = await robosatsRequest({
    path: '/api/limits/',
  })

  return response[currencyIndex]
})
