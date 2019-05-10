import {
  FunctionMap,
  Action,
  ResourceTypes,
  SagaEventHandler,
  ResourceActions,
  ResourceApi,
  ResourceEventHandlers,
  SagaTree,
} from './types'
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { forEach, map } from 'lodash'

export function* createEffects(typeToSagaMap: FunctionMap) {
  yield all(map(typeToSagaMap, (saga, type) => takeLatest(type, saga)))
}

export const getTypeToSagaMap = (sagaTree: SagaTree, result: FunctionMap = {}) =>
  forEach(sagaTree, (value, key) => {
    if (typeof value === 'function') result[key] = value // eslint-disable-line
    else getTypeToSagaMap(value, result)
  })

interface ModifyResource {
  createActions: (id?: string) => ResourceActions,
  setProgress: 'setLoadProgress' | 'setCreateProgress' | 'setUpdateProgress' | 'setRemoveProgress',
  setSuccess: 'setLoadSuccess' | 'setCreateSuccess' | 'setUpdateSuccess' | 'setRemoveSuccess',
  setError: 'setLoadError' | 'setCreateError' | 'setUpdateError' | 'setRemoveError',
  execute: (data: any) => Promise<any>,
  onSuccess?: SagaEventHandler,
}

export const loadResource = (
  createActions: (id?: string) => ResourceActions,
  load: (params?: Object) => Promise<any>,
  onSuccess?: SagaEventHandler,
) => {
  return function* ({ id, params }: Action) {
    const { setLoadProgress, setLoadSuccess, setLoadError } = createActions(id)
    try {
      yield put(setLoadProgress())
      const data = yield call(load, { ...params, id })
      yield put(setLoadSuccess(data))
      if (onSuccess) yield  onSuccess({ requestData: { ...params, id }, responseData: data })
    } catch (error) {
      yield put(setLoadError(error))
    }
  }
}

export const modifyResource = (props: ModifyResource) => {
  const { createActions, setProgress, setSuccess, setError, execute, onSuccess } = props

  return function* ({ id, data }: Action) {
    const actions = createActions(id)
    try {
      yield put(actions[setProgress]())
      const response = yield call(execute, data)
      yield put(actions[setSuccess]())
      if (onSuccess) yield onSuccess({ requestData: data, responseData: response })
    } catch (error) {
      yield put(actions[setError](error))
    }
  }
}

export const missingSagaError = ({ type }: Action) => {
  throw new Error(`Missing saga for resource. No api function has been provided for action ${type}`)
}

const createSagas = (
  createActions: (id?: string) => ResourceActions,
  types: ResourceTypes,
  api: ResourceApi,
  onSuccess: ResourceEventHandlers = {},
) => {
  const sagas: FunctionMap = {}

  if (api.load) sagas[types.LOAD] = loadResource(createActions, api.load, onSuccess.load)
  else sagas[types.LOAD] = missingSagaError

  if (api.create) {
    const createSaga = modifyResource({
      createActions,
      setProgress: 'setCreateProgress',
      setSuccess: 'setCreateSuccess',
      setError: 'setCreateError',
      execute: api.create,
      onSuccess: onSuccess.create,
    })

    sagas[types.CREATE] = createSaga
  } else {
    sagas[types.CREATE] = missingSagaError
  }

  if (api.update) {
    const updateSaga = modifyResource({
      createActions,
      setProgress: 'setUpdateProgress',
      setSuccess: 'setUpdateSuccess',
      setError: 'setUpdateError',
      execute: api.update,
      onSuccess: onSuccess.update,
    })

    sagas[types.UPDATE] = updateSaga
  } else {
    sagas[types.UPDATE] = missingSagaError
  }

  if (api.remove) {
    const removeSaga = modifyResource({
      createActions,
      setProgress: 'setRemoveProgress',
      setSuccess: 'setRemoveSuccess',
      setError: 'setRemoveError',
      execute: api.remove,
      onSuccess: onSuccess.remove,
    })

    sagas[types.REMOVE] = removeSaga
  } else {
    sagas[types.REMOVE] = missingSagaError
  }

  return sagas
}

export const createResourceSagas = (
  actions: ResourceActions,
  types: ResourceTypes,
  api: ResourceApi,
  onSuccess?: ResourceEventHandlers,
) => createSagas(
  () => actions,
  types,
  api,
  onSuccess,
)

export const createDynamicResourceSagas = createSagas
