import { v4 as uuidv4 } from 'uuid'
import createError from 'http-errors'
import * as todosAccess from '../dataLayer/todosAccess.mjs'
import { getAttachmentUrl, getUploadUrl } from '../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todos')

function handleNotFound(error, todoId) {
  if (error.name === 'ConditionalCheckFailedException') {
    throw createError(404, `Todo ${todoId} not found`)
  }
  throw error
}

export async function getTodos(userId) {
  logger.info('Getting todos', { userId })
  return todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId, newTodo) {
  const todoItem = {
    userId,
    todoId: uuidv4(),
    createdAt: new Date().toISOString(),
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false
  }
  logger.info('Creating todo', { userId, todoId: todoItem.todoId })
  return todosAccess.createTodoItem(todoItem)
}

export async function updateTodo(userId, todoId, updatedTodo) {
  logger.info('Updating todo', { userId, todoId })
  try {
    await todosAccess.updateTodoItem(userId, todoId, updatedTodo)
  } catch (error) {
    handleNotFound(error, todoId)
  }
}

export async function deleteTodo(userId, todoId) {
  logger.info('Deleting todo', { userId, todoId })
  try {
    await todosAccess.deleteTodoItem(userId, todoId)
  } catch (error) {
    handleNotFound(error, todoId)
  }
}

export async function createAttachmentPresignedUrl(userId, todoId) {
  logger.info('Generating upload URL', { userId, todoId })
  try {
    await todosAccess.updateAttachmentUrl(userId, todoId, getAttachmentUrl(todoId))
  } catch (error) {
    handleNotFound(error, todoId)
  }
  return getUploadUrl(todoId)
}
