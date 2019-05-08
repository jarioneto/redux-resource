import { FunctionMap, Action, ResourceTypes, Resource, Status } from './types'

export const createReducer = (initialState: Object, actions: FunctionMap) =>
  (state: Object = initialState, action: Action) => {
    const reducer = actions[action.type]

    return reducer ? reducer(state, action) : state
  }


export const initialState: Resource<any> = {
  data: null,
  load: { status: Status.Pristine, error: null },
  create: { status: Status.Pristine, error: null },
  update: { status: Status.Pristine, error: null },
  remove: { status: Status.Pristine, error: null },
}
  
export const createResourceReducer = (types: ResourceTypes) => {

  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, load: { status: Status.Pending, error: null } }),
    [types.LOAD_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, load: { status: Status.Error, error } }),
    [types.LOAD_SUCCESS]: (state: Resource<any>, { data }: Action) =>
      ({ ...state, data, load: { status: Status.Success, error: null } }),
    [types.RESET_LOAD_STATUS]: (state: Resource<any>) =>
      ({ ...state, data: null, load: { status: Status.Pristine, error: null } }),

    [types.CREATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: Status.Pending, error: null } }),
    [types.CREATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, create: { status: Status.Error, error } }),
    [types.CREATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, create: { status: Status.Success, error: null } }),
    [types.RESET_CREATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, create: { status: Status.Pristine, error: null } }),

    [types.UPDATE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: Status.Pending, error: null } }),
    [types.UPDATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, update: { status: Status.Error, error } }),
    [types.UPDATE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, update: { status: Status.Success, error: null } }),
    [types.RESET_UPDATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, update: { status: Status.Pristine, error: null } }),

    [types.REMOVE_PROGRESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: Status.Pending, error: null } }),
    [types.REMOVE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, remove: { status: Status.Error, error } }),
    [types.REMOVE_SUCCESS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: Status.Success, error: null } }),
    [types.RESET_REMOVE_STATUS]: (state: Resource<any>) =>
      ({ ...state, remove: { status: Status.Pristine, error: null } }),
  }

  return createReducer(initialState, actions)
}
