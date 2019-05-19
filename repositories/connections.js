import * as dynamoDb from './dynamodb'

const tableName = process.env.CONNECTION_TABLE

export const add = async connectionId => {
  console.log('connecting', connectionId)
  const addResult = await dynamoDb.addToTable({ connectionId }, tableName)
  console.log('addResult', addResult)
  return addResult
}

export const remove = async connectionId => {
  console.log('removing', connectionId)
  const removeResult = await dynamoDb.removeByPrimary(connectionId, tableName, { keyName: 'connectionId' })
  console.log('removeResult', removeResult)
  return removeResult
}

export const listConnections = async () => (await dynamoDb.scanTable(tableName)).Items
