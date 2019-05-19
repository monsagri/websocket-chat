export const responseBuilder = func => async () => {
  try {
    const result = await func()
    console.log('about to return ', { statusCode: 200, body: JSON.stringify(result) })
    return { statusCode: 200, body: JSON.stringify(result) }
  } catch (e) {
    return { statusCode: 500, body: e }
  }
}
