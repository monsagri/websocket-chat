import { addToTable } from './dynamodb'

const tableName = process.env.MESSAGE_TABLE

export const subscribeToChannel = async (connectionId, channelId) => {
  return await addToTable({channelId, connectionId}, tableName)
}
