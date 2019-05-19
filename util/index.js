export const lambdaWrapper = func => async (event, context, callback) => {
  try {
    console.log('event in handler:', event)
    const result = await func(event, context, callback)
    console.log('about to return ', { statusCode: 200, body: JSON.stringify(result) })
    return { statusCode: 200, body: JSON.stringify(result) }
  } catch (e) {
    console.log('error in responsebuilder, about to return', e)
    return { statusCode: 500, body: e, error: e }
  }
}
