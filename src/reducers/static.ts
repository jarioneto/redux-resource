import { FunctionMap, Action, ResourceTypes, Resource, Status } from '../types'
import { createReducer, createResourceInitialState } from './utils'

const createResourceReducer = (types: ResourceTypes) => {
  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, load: { status: Status.pending, error: null } }),
    [types.LOAD_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, load: { status: Status.error, error } }),
    [types.LOAD_SUCCESS]: (state: Resource<any>, { data }: Action) =>
      ({ ...state, data, load: { status: Status.success, error: null } }),
    [types.RESET_LOAD_STATUS]: (state: Resource<any>) =>
      ({ ...state, data: null, load: { status: Status.pristine, error: null } }),

    [types.CREATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: Status.pending, error: null } }),
    [types.CREATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, create: { status: Status.error, error } }),
    [types.CREATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: Status.success, error: null } }),
    [types.RESET_CREATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, create: { status: Status.pristine, error: null } }),

    [types.UPDATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: Status.pending, error: null } }),
    [types.UPDATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, update: { status: Status.error, error } }),
    [types.UPDATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: Status.success, error: null } }),
    [types.RESET_UPDATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, update: { status: Status.pristine, error: null } }),

    [types.REMOVE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: Status.pending, error: null } }),
    [types.REMOVE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, remove: { status: Status.error, error } }),
    [types.REMOVE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: Status.success, error: null } }),
    [types.RESET_REMOVE_STATUS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: Status.pristine, error: null } }),
  }

  return createReducer(createResourceInitialState(), actions)
}

export default createResourceReducer
