import { addToTable, removeByPrimary } from './dynamodb'

export const add = async connectionId => {
  const addResult = await addToTable({ connectionId }, 'connections')
  console.log('addResult', addResult)
  return addResult
}

export const remove = async connectionId => {
  console.log('removing', connectionId)
  const removeResult = await removeByPrimary(connectionId, 'connections', { name: connectionId })
  console.log('removeResult', removeResult)
  return removeResult
}
