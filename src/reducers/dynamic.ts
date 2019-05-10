import { FunctionMap, DynamicAction, ResourceTypes, DynamicResource, Resource } from '../types'
import { status } from '../status'
import { createReducer, createResourceInitialState } from './utils'

const merge = (state: DynamicResource<any>, id: string, newValue: Partial<Resource<any>>) => {
  const resource = state[id] || createResourceInitialState()

  return { ...state, [id]: { ...resource, ...newValue } }
}

const createDynamicResourceReducer = (types: ResourceTypes) => {
  const initialState = {}

  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { load: { status: status.pending, error: null } }),
    [types.LOAD_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { load: { status: status.error, error: error! } }),
    [types.LOAD_SUCCESS]: (state: DynamicResource<any>, { id, data }: DynamicAction) =>
      merge(state, id, { data, load: { status: status.success, error: null } }),
    [types.RESET_LOAD_STATUS]: (state: DynamicResource<any>, { id }) =>
      merge(state, id, { data: null, load: { status: status.pristine, error: null } }),

    [types.CREATE_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { create: { status: status.pending, error: null } }),
    [types.CREATE_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { create: { status: status.error, error: error! } }),
    [types.CREATE_SUCCESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { create: { status: status.success, error: null } }),
    [types.RESET_CREATE_STATUS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { create: { status: status.pristine, error: null } }),

    [types.UPDATE_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { update: { status: status.pending, error: null } }),
    [types.UPDATE_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { update: { status: status.error, error: error! } }),
    [types.UPDATE_SUCCESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { update: { status: status.success, error: null } }),
    [types.RESET_UPDATE_STATUS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { update: { status: status.pristine, error: null } }),

    [types.REMOVE_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { remove: { status: status.pending, error: null } }),
    [types.REMOVE_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { remove: { status: status.error, error: error! } }),
    [types.REMOVE_SUCCESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { remove: { status: status.success, error: null } }),
    [types.RESET_REMOVE_STATUS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { remove: { status: status.pristine, error: null } }),
  }

  return createReducer(initialState, actions)
}

export default createDynamicResourceReducer
