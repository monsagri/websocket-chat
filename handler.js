import { responseBuilder } from './util'
import * as service from './services'

const success = {
  statusCode: 200
}

export const connectionHandler = responseBuilder(async ({ requestContext: { connectionId, routeKey } }) =>
  routeKey === '$connect'
    ? await service.saveConnectionInfoToDynamoDB(connectionId)
    : await service.deleteConnectionInfoFromDynamoDB(connectionId)
)

export const defaultRoute = async event => {
  console.log('event in default: ', event)
  return success
}

export const test = async event => {
  console.log('event in test: ', event)
  return success
}

// assume there is other logic and processes that save "channel" subscriptions for each
// subscriber, along with their connectionId information

export const messageHandler = async event => {
  const payload = JSON.parse(event.body)

  // fetch anyone subscribed to a channel defined in payload for a datastore
  const subscribers = await service.getSubscribersToChannel(payload.channelId)

  // for each subscriber to the channel, we have to send a message per connection
  // (no batch, one call to Api Gateway Management API per message)
  const messages = subscribers.map(async subscriber => {
    return service.sendMessageToSubscriber(subscriber.connectionId, payload)
  })

  // make sure they all send
  await Promise.all(messages)

  // still have to let api gateway know we were succesful!
  return success
}

export const listConnections = responseBuilder(async () => await service.listConnections())
