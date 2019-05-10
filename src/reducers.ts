import { FunctionMap, Action, ResourceTypes, Resource, DynamicResource } from './types'
import { status } from './status'
import { AnyAction } from 'redux'

export const createReducer = (initialState: Object, actions: FunctionMap) =>
  (state: Object = initialState, action: Action) => {
    const reducer = actions[action.type]

    return reducer ? reducer(state, action) : state
  }

export const createResourceReducer = (types: ResourceTypes) => {
  const initialState: Resource<any> = {
    data: null,
    load: { status: status.pristine, error: null },
    create: { status: status.pristine, error: null },
    update: { status: status.pristine, error: null },
    remove: { status: status.pristine, error: null },
  }

  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, load: { status: status.pending, error: null } }),
    [types.LOAD_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, load: { status: status.error, error } }),
    [types.LOAD_SUCCESS]: (state: Resource<any>, { data }: Action) =>
      ({ ...state, data, load: { status: status.success, error: null } }),
    [types.RESET_LOAD_STATUS]: (state: Resource<any>) =>
      ({ ...state, data: null, load: { status: status.pristine, error: null } }),

    [types.CREATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: status.pending, error: null } }),
    [types.CREATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, create: { status: status.error, error } }),
    [types.CREATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: status.success, error: null } }),
    [types.RESET_CREATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, create: { status: status.pristine, error: null } }),

    [types.UPDATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: status.pending, error: null } }),
    [types.UPDATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, update: { status: status.error, error } }),
    [types.UPDATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: status.success, error: null } }),
    [types.RESET_UPDATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, update: { status: status.pristine, error: null } }),

    [types.REMOVE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: status.pending, error: null } }),
    [types.REMOVE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, remove: { status: status.error, error } }),
    [types.REMOVE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: status.success, error: null } }),
    [types.RESET_REMOVE_STATUS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: status.pristine, error: null } }),
  }

  return createReducer(initialState, actions)
}

export const createDynamicResourceReducer = (types: ResourceTypes) => {
  const initialState = {}

  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: DynamicResource<any>, { id }: AnyAction) =>
      ({ ...state, [id]: { ...state[id], load: { status: status.pending, error: null } } }),
    [types.LOAD_ERROR]: (state: DynamicResource<any>, { id, error }: AnyAction) =>
      ({ ...state, [id]: { ...state[id], load: { status: status.error, error } } }),
    [types.LOAD_SUCCESS]: (state: DynamicResource<any>, { id, data }: AnyAction) =>
      ({ ...state, [id]: { ...state[id], data, load: { status: status.success, error: null } } }),
    [types.RESET_LOAD_STATUS]: (state: DynamicResource<any>, { id }) =>
      ({ ...state, [id]: { ...state[id], data: null, load: { status: status.pristine, error: null } } }),

    [types.CREATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: status.pending, error: null } }),
    [types.CREATE_ERROR]: (state: Resource<any>, { error }: AnyAction) =>
      ({ ...state, create: { status: status.error, error } }),
    [types.CREATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: status.success, error: null } }),
    [types.RESET_CREATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, create: { status: status.pristine, error: null } }),

    [types.UPDATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: status.pending, error: null } }),
    [types.UPDATE_ERROR]: (state: Resource<any>, { error }: AnyAction) =>
      ({ ...state, update: { status: status.error, error } }),
    [types.UPDATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: status.success, error: null } }),
    [types.RESET_UPDATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, update: { status: status.pristine, error: null } }),

    [types.REMOVE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: status.pending, error: null } }),
    [types.REMOVE_ERROR]: (state: Resource<any>, { error }: AnyAction) =>
      ({ ...state, remove: { status: status.error, error } }),
    [types.REMOVE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: status.success, error: null } }),
    [types.RESET_REMOVE_STATUS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: status.pristine, error: null } }),
  }
}
