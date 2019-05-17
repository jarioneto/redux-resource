import { ResourceActions } from '../types'
import createTypes from './actionTypes'

const createResourceActions = (namespace: string) => {
  const types = createTypes(namespace)

  const actions: ResourceActions = {
    load: params => ({ type: types.LOAD, params }),
    setLoadPending: () => ({ type: types.LOAD_PENDING }),
    setLoadSuccess: data => ({ type: types.LOAD_SUCCESS, data }),
    setLoadError: error => ({ type: types.LOAD_ERROR, error }),
    resetLoadStatus: () => ({ type: types.RESET_LOAD_STATUS }),

    create: data => ({ type: types.CREATE, data }),
    setCreatePending: () => ({ type: types.CREATE_PENDING }),
    setCreateSuccess: () => ({ type: types.CREATE_SUCCESS }),
    setCreateError: error => ({ type: types.CREATE_ERROR, error }),
    resetCreateStatus: () => ({ type: types.RESET_CREATE_STATUS }),

    update: data => ({ type: types.UPDATE, data }),
    setUpdatePending: () => ({ type: types.UPDATE_PENDING }),
    setUpdateSuccess: () => ({ type: types.UPDATE_SUCCESS }),
    setUpdateError: error => ({ type: types.UPDATE_ERROR, error }),
    resetUpdateStatus: () => ({ type: types.RESET_UPDATE_STATUS }),

    remove: data => ({ type: types.REMOVE, data }),
    setRemovePending: () => ({ type: types.REMOVE_PENDING }),
    setRemoveSuccess: () => ({ type: types.REMOVE_SUCCESS }),
    setRemoveError: error => ({ type: types.REMOVE_ERROR, error }),
    resetRemoveStatus: () => ({ type: types.RESET_REMOVE_STATUS }),
  }

  return { types, actions }
}

export default createResourceActions
