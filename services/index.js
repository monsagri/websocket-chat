import * as channelRepo from '../repositories/channels'
import * as connectionRepo from '../repositories/connections'
import * as messageRepo from '../repositories/messages'

export const saveConnectionInfoToDynamoDB = connectionRepo.add
export const deleteConnectionInfoFromDynamoDB = connectionRepo.remove

export const getSubscribersToChannel = channelRepo.listSubscribers

export const sendMessageToSubscriber = messageRepo.sendMessage

export const listConnections = connectionRepo.listConnections