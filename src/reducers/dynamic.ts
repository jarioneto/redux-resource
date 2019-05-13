import { Status, FunctionMap, DynamicAction, ResourceTypes, DynamicResource, Resource } from '../types'
import { createReducer, createResourceInitialState } from './utils'

const merge = (state: DynamicResource<any>, id: string, newValue: Partial<Resource<any>>) => {
  const resource = state[id] || createResourceInitialState()

  return { ...state, [id]: { ...resource, ...newValue } }
}

const createDynamicResourceReducer = (types: ResourceTypes) => {
  const initialState = {}

  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { load: { status: Status.pending, error: null } }),
    [types.LOAD_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { load: { status: Status.error, error: error! } }),
    [types.LOAD_SUCCESS]: (state: DynamicResource<any>, { id, data }: DynamicAction) =>
      merge(state, id, { data, load: { status: Status.success, error: null } }),
    [types.RESET_LOAD_STATUS]: (state: DynamicResource<any>, { id }) =>
      merge(state, id, { data: null, load: { status: Status.pristine, error: null } }),

    [types.CREATE_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { create: { status: Status.pending, error: null } }),
    [types.CREATE_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { create: { status: Status.error, error: error! } }),
    [types.CREATE_SUCCESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { create: { status: Status.success, error: null } }),
    [types.RESET_CREATE_STATUS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { create: { status: Status.pristine, error: null } }),

    [types.UPDATE_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { update: { status: Status.pending, error: null } }),
    [types.UPDATE_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { update: { status: Status.error, error: error! } }),
    [types.UPDATE_SUCCESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { update: { status: Status.success, error: null } }),
    [types.RESET_UPDATE_STATUS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { update: { status: Status.pristine, error: null } }),

    [types.REMOVE_PROGRESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { remove: { status: Status.pending, error: null } }),
    [types.REMOVE_ERROR]: (state: DynamicResource<any>, { id, error }: DynamicAction) =>
      merge(state, id, { remove: { status: Status.error, error: error! } }),
    [types.REMOVE_SUCCESS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { remove: { status: Status.success, error: null } }),
    [types.RESET_REMOVE_STATUS]: (state: DynamicResource<any>, { id }: DynamicAction) =>
      merge(state, id, { remove: { status: Status.pristine, error: null } }),
  }

  return createReducer(initialState, actions)
}

export default createDynamicResourceReducer
