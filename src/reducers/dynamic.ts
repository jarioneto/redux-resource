import { FunctionMap, DynamicAction, ResourceTypes, DynamicResource } from '../types'
import { status } from '../status'
import { createReducer } from './utils'

const createDynamicResourceReducer = (types: ResourceTypes) => {
  const initialState = {}

  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      ({ ...state, [id]: { ...state[id], load: { status: status.pending, error: null } } }),
    [types.LOAD_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      ({ ...state, [id]: { ...state[id], load: { status: status.error, error } } }),
    [types.LOAD_SUCCESS]: (state: DynamicResource<any>, { id, data }: DynamicAction) =>
      ({ ...state, [id]: { ...state[id], data, load: { status: status.success, error: null } } }),
    [types.RESET_LOAD_STATUS]: (state: DynamicResource<any>, { id }) =>
      ({ ...state, [id]: { ...state[id], data: null, load: { status: status.pristine, error: null } } }),

    [types.CREATE_PROGRESS]: (state: DynamicResource<any>) =>
      ({ ...state, create: { status: status.pending, error: null } }),
    [types.CREATE_ERROR]: (state: DynamicResource<any>, { error }: DynamicAction) =>
      ({ ...state, create: { status: status.error, error } }),
    [types.CREATE_SUCCESS]: (state: DynamicResource<any>) =>
      ({ ...state, create: { status: status.success, error: null } }),
    [types.RESET_CREATE_STATUS]: (state: DynamicResource<any>) =>
      ({ ...state, create: { status: status.pristine, error: null } }),

    [types.UPDATE_PROGRESS]: (state: DynamicResource<any>) =>
      ({ ...state, update: { status: status.pending, error: null } }),
    [types.UPDATE_ERROR]: (state: DynamicResource<any>, { error }: DynamicAction) =>
      ({ ...state, update: { status: status.error, error } }),
    [types.UPDATE_SUCCESS]: (state: DynamicResource<any>) =>
      ({ ...state, update: { status: status.success, error: null } }),
    [types.RESET_UPDATE_STATUS]: (state: DynamicResource<any>) =>
      ({ ...state, update: { status: status.pristine, error: null } }),

    [types.REMOVE_PROGRESS]: (state: DynamicResource<any>) =>
      ({ ...state, remove: { status: status.pending, error: null } }),
    [types.REMOVE_ERROR]: (state: DynamicResource<any>, { error }: DynamicAction) =>
      ({ ...state, remove: { status: status.error, error } }),
    [types.REMOVE_SUCCESS]: (state: DynamicResource<any>) =>
      ({ ...state, remove: { status: status.success, error: null } }),
    [types.RESET_REMOVE_STATUS]: (state: DynamicResource<any>) =>
      ({ ...state, remove: { status: status.pristine, error: null } }),
  }

  return createReducer(initialState, actions)
}

export default createDynamicResourceReducer
