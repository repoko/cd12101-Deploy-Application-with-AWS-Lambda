import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDB())
const docClient = DynamoDBDocument.from(dynamoDbClient)

const todosTable = process.env.TODOS_TABLE
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX

export async function getTodosForUser(userId) {
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: todosCreatedAtIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId }
  })
  return result.Items
}

export async function createTodoItem(todoItem) {
  await docClient.put({
    TableName: todosTable,
    Item: todoItem
  })
  return todoItem
}

export async function updateTodoItem(userId, todoId, todoUpdate) {
  await docClient.update({
    TableName: todosTable,
    Key: { userId, todoId },
    ConditionExpression: 'attribute_exists(todoId)',
    UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#dueDate': 'dueDate',
      '#done': 'done'
    },
    ExpressionAttributeValues: {
      ':name': todoUpdate.name,
      ':dueDate': todoUpdate.dueDate,
      ':done': todoUpdate.done
    }
  })
}

export async function deleteTodoItem(userId, todoId) {
  await docClient.delete({
    TableName: todosTable,
    Key: { userId, todoId },
    ConditionExpression: 'attribute_exists(todoId)'
  })
}

export async function updateAttachmentUrl(userId, todoId, attachmentUrl) {
  await docClient.update({
    TableName: todosTable,
    Key: { userId, todoId },
    ConditionExpression: 'attribute_exists(todoId)',
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: { ':attachmentUrl': attachmentUrl }
  })
}
