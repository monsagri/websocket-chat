import * as channelRepo from '../repositories/channels'
import * as connectionRepo from '../repositories/connections'
import * as messageRepo from '../repositories/messages'


export const saveConnectionInfoToDynamoDB = connectionRepo.save
export const deleteConnectionInfoFromDynamoDB = connectionRepo.delete

export const getSubscribersToChannel = channelRepo.listSubscribers

export const sendMessageToSubscriber = messageRepo.sendMessage