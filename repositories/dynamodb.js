import AWS from 'aws-sdk'

AWS.config.update({
  region: 'eu-west-2',
  endpoint: 'https://dynamodb.eu-west-2.amazonaws.com'
})

const dynamodbClient = new AWS.DynamoDB.DocumentClient()

export const addToTable = async (Item, TableName) => {
  const params = {
    TableName,
    Item
  }
  console.log('adding with params:', params)
  return await dynamodbClient.put(params).promise()
}

export const removeByPrimary = async (itemKey, TableName, { keyName }) => {
  const params = {
    TableName,
    Key: {
      [keyName]: itemKey
    }
  }
  console.log('removing with params ', params)
  return await dynamodbClient.delete(params).promise()
}

// This is the only way it seems to get stuff into a list, but it looks like a fucking pain

export const scanTable = async TableName => {
  const params = {
    TableName
  }
  return await dynamodbClient.scan(params).promise()
}

// HERE LIVE WIPS

export const getItemByPrimary = async (TableName, { keyName, keyValue }) => {
  const params = {
    TableName,
    Key: {
      [keyName]: keyValue
    }
  }
  return await dynamodbClient.get(params).promise()
}

export const addToArray = async (TableName, channelId, arrayName, arrayItem) => {
  const params = {
    TableName
  }
  return await dynamodbClient.update(params.promise)
}

export const removeFromArray = async (TableName, channelId, arrayName, arrayItem) => {
  const params = {
    TableName
  }
  return await dynamodbClient.update(params.promise)
}

// where is momngoose when you need it
export const updateItem = async () => {
  // const updateResult = await dynamodbClient.updateItem().promise
  console.log('need to make updateItem work')
}
