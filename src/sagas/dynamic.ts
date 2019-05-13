import {
  FunctionMap,
  DynamicAction,
  ResourceTypes,
  DynamicSagaEventHandler,
  DynamicResourceActions,
  DynamicResourceApi,
  DynamicResourceEventHandlers,
} from '../types'
import { call, put } from 'redux-saga/effects'
import { missingSagaError } from './utils'

interface ModifyResource {
  setProgress: (id: string) => DynamicAction,
  setSuccess: (id: string) => DynamicAction,
  setError: (id: string, error: any) => DynamicAction,
  execute: (id: string, data?: any) => Promise<any>,
  onSuccess?: DynamicSagaEventHandler,
}

const loadResource = (
  actions: DynamicResourceActions,
  load: (id: string, params?: Object) => Promise<any>,
  onSuccess?: DynamicSagaEventHandler,
) => {
  return function* ({ id, params }: DynamicAction) {
    const { setLoadProgress, setLoadSuccess, setLoadError } = actions
    try {
      yield put(setLoadProgress(id))
      const data = yield call(load, id, params)
      yield put(setLoadSuccess(id, data))
      if (onSuccess) yield onSuccess({ id, requestData: { ...params, id }, responseData: data })
    } catch (error) {
      yield put(setLoadError(id, error))
    }
  }
}

const modifyResource = (props: ModifyResource) => {
  const { setProgress, setSuccess, setError, execute, onSuccess } = props

  return function* ({ id, data }: DynamicAction) {
    try {
      yield put(setProgress(id))
      const response = yield call(execute, id, data)
      yield put(setSuccess(id))
      if (onSuccess) yield onSuccess({ id, requestData: data, responseData: response })
    } catch (error) {
      yield put(setError(id, error))
    }
  }
}

const createDynamicResourceSagas = (
  actions: DynamicResourceActions,
  types: ResourceTypes,
  api: DynamicResourceApi,
  onSuccess: DynamicResourceEventHandlers = {},
) => {
  const sagas: FunctionMap = {}

  if (api.load) sagas[types.LOAD] = loadResource(actions, api.load, onSuccess.load)
  else sagas[types.LOAD] = missingSagaError

  if (api.create) {
    const createSaga = modifyResource({
      setProgress: actions.setCreateProgress,
      setSuccess: actions.setCreateSuccess,
      setError: actions.setCreateError,
      execute: api.create,
      onSuccess: onSuccess.create,
    })

    sagas[types.CREATE] = createSaga
  } else {
    sagas[types.CREATE] = missingSagaError
  }

  if (api.update) {
    const updateSaga = modifyResource({
      setProgress: actions.setUpdateProgress,
      setSuccess: actions.setUpdateSuccess,
      setError: actions.setUpdateError,
      execute: api.update,
      onSuccess: onSuccess.update,
    })

    sagas[types.UPDATE] = updateSaga
  } else {
    sagas[types.UPDATE] = missingSagaError
  }

  if (api.remove) {
    const removeSaga = modifyResource({
      setProgress: actions.setRemoveProgress,
      setSuccess: actions.setRemoveSuccess,
      setError: actions.setRemoveError,
      execute: api.remove,
      onSuccess: onSuccess.remove,
    })

    sagas[types.REMOVE] = removeSaga
  } else {
    sagas[types.REMOVE] = missingSagaError
  }

  return sagas
}

export default createDynamicResourceSagas
