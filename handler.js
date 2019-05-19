import { lambdaWrapper } from './util'
import * as service from './services'

export const connectionHandler = lambdaWrapper(async ({ requestContext: { connectionId, routeKey } }) =>
  routeKey === '$connect'
    ? await service.saveConnectionInfoToDynamoDB(connectionId)
    : await service.deleteConnectionInfoFromDynamoDB(connectionId)
)

export const channelHandler = lambdaWrapper(
  async ({
    requestContext: {
      connectionId,
      routeKey,
      body: { channelId }
    }
  }) =>
    routeKey === '$join'
      ? await service.joinChannel(connectionId, channelId)
      : await service.leaveChannel((connectionId, channelId))
)

export const defaultRoute = lambdaWrapper(() => 'No action taken')

// assume there is other logic and processes that save "channel" subscriptions for each
// subscriber, along with their connectionId information

// export const messageHandler = async event => {
//   const payload = JSON.parse(event.body)

//   // fetch anyone subscribed to a channel defined in payload for a datastore
//   const subscribers = await service.getSubscribersToChannel(payload.channelId)

//   // for each subscriber to the channel, we have to send a message per connection
//   // (no batch, one call to Api Gateway Management API per message)
//   const messages = subscribers.map(async subscriber => {
//     return service.sendMessageToSubscriber(subscriber.connectionId, payload)
//   })

//   // make sure they all send
//   await Promise.all(messages)

//   // still have to let api gateway know we were succesful!
//   return success
// }

export const listConnections = lambdaWrapper(async () => await service.listConnections())
