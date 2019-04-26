export const createResourceActions = (namespace: string) => {
  const types: ResourceTypes = {
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
  }

  const actions: ResourceActions = {
    load: (params: any): Action => ({ type: types.LOAD, params }),
    setLoadProgress: (): Action => ({ type: types.LOAD_PROGRESS }),
    setLoadSuccess: (data: any): Action => ({ type: types.LOAD_SUCCESS, data }),
    setLoadError: (error: any): Action => ({ type: types.LOAD_ERROR, error }),
    resetLoadStatus: (): Action => ({ type: types.RESET_LOAD_STATUS }),

    create: (data: any): Action => ({ type: types.CREATE, data }),
    setCreateProgress: (): Action => ({ type: types.CREATE_PROGRESS }),
    setCreateSuccess: (): Action => ({ type: types.CREATE_SUCCESS }),
    setCreateError: (error: any): Action => ({ type: types.CREATE_ERROR, error }),
    resetCreateStatus: (): Action => ({ type: types.RESET_CREATE_STATUS }),

    update: (data: any): Action => ({ type: types.UPDATE, data }),
    setUpdateProgress: (): Action => ({ type: types.UPDATE_PROGRESS }),
    setUpdateSuccess: (): Action => ({ type: types.UPDATE_SUCCESS }),
    setUpdateError: (error: any): Action => ({ type: types.UPDATE_ERROR, error }),
    resetUpdateStatus: (): Action => ({ type: types.RESET_UPDATE_STATUS }),

    remove: (data: any): Action => ({ type: types.REMOVE, data }),
    setRemoveProgress: (): Action => ({ type: types.REMOVE_PROGRESS }),
    setRemoveSuccess: (): Action => ({ type: types.REMOVE_SUCCESS }),
    setRemoveError: (error: any): Action => ({ type: types.REMOVE_ERROR, error }),
    resetRemoveStatus: (): Action => ({ type: types.RESET_REMOVE_STATUS }),
  }

  return { types, actions }
}
