import {
  FunctionMap,
  Action,
  ResourceTypes,
  SagaEventHandler,
  ResourceActions,
  ResourceApi,
  ResourceEventHandlers,
} from '../types'
import { call, put } from 'redux-saga/effects'
import { createMissingSagaWarning } from './utils'

interface ModifyResource {
  setPending: () => Action,
  setSuccess: () => Action,
  setError: (error: Object) => Action,
  execute: (data: any) => Promise<any>,
  onSuccess?: SagaEventHandler,
}

export const loadResource = (
  actions: ResourceActions,
  load: (params?: Object) => Promise<any>,
  onSuccess?: SagaEventHandler,
) => {
  return function* ({ params }: Action) {
    const { setLoadPending, setLoadSuccess, setLoadError } = actions
    try {
      yield put(setLoadPending())
      const data = yield call(load, params)
      yield put(setLoadSuccess(data))
      if (onSuccess) yield onSuccess({ requestData: params, responseData: data })
    } catch (error) {
      yield put(setLoadError(error))
    }
  }
}

export const modifyResource = (props: ModifyResource) => {
  const { setPending, setSuccess, setError, execute, onSuccess } = props

  return function* ({ data }: Action) {
    try {
      yield put(setPending())
      const response = yield call(execute, data)
      yield put(setSuccess())
      if (onSuccess) yield onSuccess({ requestData: data, responseData: response })
    } catch (error) {
      yield put(setError(error))
    }
  }
}

const createResourceSagas = (
  actions: ResourceActions,
  types: ResourceTypes,
  api: ResourceApi,
  onSuccess: ResourceEventHandlers = {},
) => {
  const sagas: FunctionMap = {}

  if (api.load) sagas[types.LOAD] = loadResource(actions, api.load, onSuccess.load)
  else sagas[types.LOAD] = createMissingSagaWarning

  if (api.create) {
    const createSaga = modifyResource({
      setPending: actions.setCreatePending,
      setSuccess: actions.setCreateSuccess,
      setError: actions.setCreateError,
      execute: api.create,
      onSuccess: onSuccess.create,
    })

    sagas[types.CREATE] = createSaga
  } else {
    sagas[types.CREATE] = createMissingSagaWarning
  }

  if (api.update) {
    const updateSaga = modifyResource({
      setPending: actions.setUpdatePending,
      setSuccess: actions.setUpdateSuccess,
      setError: actions.setUpdateError,
      execute: api.update,
      onSuccess: onSuccess.update,
    })

    sagas[types.UPDATE] = updateSaga
  } else {
    sagas[types.UPDATE] = createMissingSagaWarning
  }

  if (api.remove) {
    const removeSaga = modifyResource({
      setPending: actions.setRemovePending,
      setSuccess: actions.setRemoveSuccess,
      setError: actions.setRemoveError,
      execute: api.remove,
      onSuccess: onSuccess.remove,
    })

    sagas[types.REMOVE] = removeSaga
  } else {
    sagas[types.REMOVE] = createMissingSagaWarning
  }

  return sagas
}

export default createResourceSagas
