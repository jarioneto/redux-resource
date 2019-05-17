import { ResourceTypes } from '../types'

const createTypes = (namespace: string): ResourceTypes => ({
  LOAD: `${namespace}/LOAD`,
  LOAD_PENDING: `${namespace}/LOAD_PENDING`,
  LOAD_SUCCESS: `${namespace}/LOAD_SUCCESS`,
  LOAD_ERROR: `${namespace}/LOAD_ERROR`,
  RESET_LOAD_STATUS: `${namespace}/RESET_LOAD_STATUS`,

  CREATE: `${namespace}/CREATE`,
  CREATE_PENDING: `${namespace}/CREATE_PENDING`,
  CREATE_SUCCESS: `${namespace}/CREATE_SUCCESS`,
  CREATE_ERROR: `${namespace}/CREATE_ERROR`,
  RESET_CREATE_STATUS: `${namespace}/RESET_CREATE_STATUS`,

  UPDATE: `${namespace}/UPDATE`,
  UPDATE_PENDING: `${namespace}/UPDATE_PENDING`,
  UPDATE_SUCCESS: `${namespace}/UPDATE_SUCCESS`,
  UPDATE_ERROR: `${namespace}/UPDATE_ERROR`,
  RESET_UPDATE_STATUS: `${namespace}/RESET_UPDATE_STATUS`,

  REMOVE: `${namespace}/REMOVE`,
  REMOVE_PENDING: `${namespace}/REMOVE_PENDING`,
  REMOVE_SUCCESS: `${namespace}/REMOVE_SUCCESS`,
  REMOVE_ERROR: `${namespace}/REMOVE_ERROR`,
  RESET_REMOVE_STATUS: `${namespace}/RESET_REMOVE_STATUS`,
})

export default createTypes
