export const createReducer = (initialState: Object, actions: FunctionMap) =>
  (state: Object = initialState, action: Action) => {
    const reducer = actions[action.type]

    return reducer ? reducer(state, action) : state
  }

export const createResourceReducer = (types: ResourceTypes) => {
  const initialState: Resource<any> = {
    data: null,
    loadStatus: Status.pristine,
    createStatus: Status.pristine,
    updateStatus: Status.pristine,
    removeStatus: Status.pristine,
    loadError: null,
    createError: null,
    updateError: null,
    removeError: null,
  }

  const actions: FunctionMap = {
    [types.LOAD_PROGRESS]: (state: Resource<any>) => ({ ...state, loadStatus: Status.pending }),
    [types.LOAD_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, loadStatus: Status.error, loadError: error }),
    [types.LOAD_SUCCESS]: (state: Resource<any>, { data }: Action) =>
      ({ ...state, loadStatus: Status.success, data }),
    [types.RESET_LOAD_STATUS]: (state: Resource<any>) =>
      ({ ...state, loadStatus: Status.pristine, data: null, loadError: null }),

    [types.CREATE_PROGRESS]: (state: Resource<any>) => ({ ...state, createStatus: Status.pending }),
    [types.CREATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, createStatus: Status.error, createError: error }),
    [types.CREATE_SUCCESS]: (state: Resource<any>) => ({ ...state, createStatus: Status.success }),
    [types.RESET_CREATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, createStatus: Status.pristine, createError: null }),

    [types.UPDATE_PROGRESS]: (state: Resource<any>) => ({ ...state, updateStatus: Status.pending }),
    [types.UPDATE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, updateStatus: Status.error, updateError: error }),
    [types.UPDATE_SUCCESS]: (state: Resource<any>) => ({ ...state, updateStatus: Status.success }),
    [types.RESET_UPDATE_STATUS]: (state: Resource<any>) =>
      ({ ...state, updateStatus: Status.pristine, updateError: null }),

    [types.REMOVE_PROGRESS]: (state: Resource<any>) => ({ ...state, removeStatus: Status.pending }),
    [types.REMOVE_ERROR]: (state: Resource<any>, { error }: Action) =>
      ({ ...state, removeStatus: Status.error, removeError: error }),
    [types.REMOVE_SUCCESS]: (state: Resource<any>) => ({ ...state, removeStatus: Status.success }),
    [types.RESET_REMOVE_STATUS]: (state: Resource<any>) =>
      ({ ...state, removeStatus: Status.pristine, removeError: null }),
  }

  return createReducer(initialState, actions)
}
