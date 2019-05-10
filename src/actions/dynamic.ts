import { DynamicResourceActions } from '../types'
import createTypes from './actionTypes'

const createDynamicResourceActions = (namespace: string) => {
  const types = createTypes(namespace)

  const actions: DynamicResourceActions = {
    load: (id, params) => ({ type: types.LOAD, id, params }),
    setLoadProgress: id => ({ type: types.LOAD_PROGRESS, id }),
    setLoadSuccess: (id, data) => ({ type: types.LOAD_SUCCESS, id, data }),
    setLoadError: (id, error) => ({ type: types.LOAD_ERROR, id, error }),
    resetLoadStatus: id => ({ type: types.RESET_LOAD_STATUS, id }),

    create: (id, data) => ({ type: types.CREATE, id, data }),
    setCreateProgress: id => ({ type: types.CREATE_PROGRESS, id }),
    setCreateSuccess: id => ({ type: types.CREATE_SUCCESS, id }),
    setCreateError: (id, error) => ({ type: types.CREATE_ERROR, id, error }),
    resetCreateStatus: id => ({ type: types.RESET_CREATE_STATUS, id }),

    update: (id, data) => ({ type: types.UPDATE, id, data }),
    setUpdateProgress: id => ({ type: types.UPDATE_PROGRESS, id }),
    setUpdateSuccess: id => ({ type: types.UPDATE_SUCCESS, id }),
    setUpdateError: (id, error) => ({ type: types.UPDATE_ERROR, id, error }),
    resetUpdateStatus: id => ({ type: types.RESET_UPDATE_STATUS, id }),

    remove: (id, data) => ({ type: types.REMOVE, id, data }),
    setRemoveProgress: id => ({ type: types.REMOVE_PROGRESS, id }),
    setRemoveSuccess: id => ({ type: types.REMOVE_SUCCESS, id }),
    setRemoveError: (id, error) => ({ type: types.REMOVE_ERROR, id, error }),
    resetRemoveStatus: id => ({ type: types.RESET_REMOVE_STATUS, id }),
  }

  return { types, actions }
}

export default createDynamicResourceActions
