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
  const putResult = await dynamodbClient.put(params).promise()
  console.log('result from putting:', putResult)
  return putResult
}

export const removeByPrimary = async (itemKey, TableName, { name, type = 'S' }) => {
  const params = {
    TableName,
    Key: {
      [name]: {
        [type]: itemKey
      }
    }
  }

  console.log('removing with params ', params)
  const removeResult = delete dynamodbClient.delete({ params }).promise()
  console.log('result from putting:', removeResult)
}
