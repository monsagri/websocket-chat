import * as dynamoDb from './dynamodb'

const tableName = process.env.MESSAGE_TABLE

export const joinChannel = async (connectionId, channelId) =>
  dynamoDb.addToArray(tableName, channelId, 'connectionIds', connectionId)

export const leaveChannel = async (connectionId, channelId) =>
  dynamoDb.removeFromArray(tableName, channelId, 'connectionIds', connectionId)

export const listChannelMembers = async channelId => {
  const memberIds = (await dynamoDb.getItem(tableName, { keyName: 'channelId', keyValue: channelId }).promise())
    .connectionIds
  // Could potentially populate user data for connection Ids here
  return memberIds
}
