import { ResourceTypes, ResourceActions, Action } from './types'

const createTypes = (namespace: string): ResourceTypes => ({
  LOAD: `${namespace}/LOAD`,
  LOAD_PROGRESS: `${namespace}/LOAD_PROGRESS`,
  LOAD_SUCCESS: `${namespace}/LOAD_SUCCESS`,
  LOAD_ERROR: `${namespace}/LOAD_ERROR`,
  RESET_LOAD_STATUS: `${namespace}/RESET_LOAD_STATUS`,

  CREATE: `${namespace}/CREATE`,
  CREATE_PROGRESS: `${namespace}/CREATE_PROGRESS`,
  CREATE_SUCCESS: `${namespace}/CREATE_SUCCESS`,
  CREATE_ERROR: `${namespace}/CREATE_ERROR`,
  RESET_CREATE_STATUS: `${namespace}/RESET_CREATE_STATUS`,

  UPDATE: `${namespace}/UPDATE`,
  UPDATE_PROGRESS: `${namespace}/UPDATE_PROGRESS`,
  UPDATE_SUCCESS: `${namespace}/UPDATE_SUCCESS`,
  UPDATE_ERROR: `${namespace}/UPDATE_ERROR`,
  RESET_UPDATE_STATUS: `${namespace}/RESET_UPDATE_STATUS`,

  REMOVE: `${namespace}/REMOVE`,
  REMOVE_PROGRESS: `${namespace}/REMOVE_PROGRESS`,
  REMOVE_SUCCESS: `${namespace}/REMOVE_SUCCESS`,
  REMOVE_ERROR: `${namespace}/REMOVE_ERROR`,
  RESET_REMOVE_STATUS: `${namespace}/RESET_REMOVE_STATUS`,
})

export const createResourceActions = (namespace: string, id?: string) => {
  const types = createTypes(namespace)

  const actions: ResourceActions = {
    load: (params) => ({ type: types.LOAD, id, params }),
    setLoadProgress: () => ({ type: types.LOAD_PROGRESS, id }),
    setLoadSuccess: (data) => ({ type: types.LOAD_SUCCESS, id, data }),
    setLoadError: (error: any) => ({ type: types.LOAD_ERROR, id, error }),
    resetLoadStatus: () => ({ type: types.RESET_LOAD_STATUS, id }),

    create: (data) => ({ type: types.CREATE, id, data }),
    setCreateProgress: () => ({ type: types.CREATE_PROGRESS, id }),
    setCreateSuccess: () => ({ type: types.CREATE_SUCCESS, id }),
    setCreateError: (error: any) => ({ type: types.CREATE_ERROR, id, error }),
    resetCreateStatus: () => ({ type: types.RESET_CREATE_STATUS, id }),

    update: (data) => ({ type: types.UPDATE, id, data }),
    setUpdateProgress: () => ({ type: types.UPDATE_PROGRESS, id }),
    setUpdateSuccess: () => ({ type: types.UPDATE_SUCCESS, id }),
    setUpdateError: (error: any) => ({ type: types.UPDATE_ERROR, id, error }),
    resetUpdateStatus: () => ({ type: types.RESET_UPDATE_STATUS, id }),

    remove: (data) => ({ type: types.REMOVE, id, data }),
    setRemoveProgress: () => ({ type: types.REMOVE_PROGRESS, id }),
    setRemoveSuccess: () => ({ type: types.REMOVE_SUCCESS, id }),
    setRemoveError: (error: any) => ({ type: types.REMOVE_ERROR, id, error }),
    resetRemoveStatus: () => ({ type: types.RESET_REMOVE_STATUS, id }),
  }

  return { types, actions }
}

export const createDynamicResourceActions = (namespace: string) => ({
  types: createTypes(namespace),
  actions: (id: string) => createResourceActions(namespace, id).actions,
})
