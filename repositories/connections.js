import { addToTable, removeByPrimary } from './dynamodb'

const tableName = process.env.CONNECTION_TABLE

export const add = async connectionId => {
  const addResult = await addToTable({ connectionId }, tableName)
  console.log('addResult', addResult)
  return addResult
}

export const remove = async connectionId => {
  console.log('removing', connectionId)
  const removeResult = await removeByPrimary(connectionId, tableName, { name: connectionId })
  console.log('removeResult', removeResult)
  return removeResult
}
