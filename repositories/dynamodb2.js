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
  return (await dynamodbClient.scan(params).promise()).Items
}

export const getItemByPrimary = async (TableName, { keyName, keyValue }) => {
  const params = {
    TableName,
    Key: {
      [keyName]: keyValue
    }
  }
  return (await dynamodbClient.get(params).promise()).Item
}

export const addToArray = async (TableName, { keyName, keyValue }, arrayName, itemsToAdd = []) => {
  const params = {
    TableName,
    Key: {
      [keyName]: keyValue
    },
    UpdateExpression: `set ${arrayName} = list_append (if_not_exists(${arrayName}, :empty_list), :itemsToAdd)`,
    ExpressionAttributeValues: {
      ':itemsToAdd': itemsToAdd,
      ':empty_list': []
    }
  }
  console.log('adding with params', params)
  const addReturn = await dynamodbClient.update(params).promise()
  console.log('result from adding', addReturn)
  return addReturn
}

export const addToSet = async (TableName, { keyName, keyValue }, setName, itemsToAdd = []) => {
  const params = {
    TableName,
    Key: {
      [keyName]: keyValue
    },
    UpdateExpression: `add ${setName} :itemsToAdd`,
    ExpressionAttributeValues: {
      ':itemsToAdd': dynamodbClient.createSet(itemsToAdd)
    }
  }
  console.log('adding with params', params)
  const addReturn = await dynamodbClient.update(params).promise()
  console.log('result from adding', addReturn)
  return addReturn
}

export const removeFromSet = async (TableName, { keyName, keyValue }, setName, itemsToRemove = []) => {
  const params = {
    TableName,
    Key: {
      [keyName]: keyValue
    },
    UpdateExpression: `delete ${setName} :itemsToRemove`,
    ExpressionAttributeValues: {
      ':itemsToRemove': dynamodbClient.createSet(itemsToRemove)
    }
  }
  console.log('removing with params', params)

  const removeReturn = await dynamodbClient.update(params).promise()

  console.log('result from removing', removeReturn)
  return removeReturn
}

// HERE LIVE WIPS

// where is mongoose when you need it
export const updateItem = async () => {
  // const updateResult = await dynamodbClient.updateItem().promise
  console.log('need to make updateItem work')
}
