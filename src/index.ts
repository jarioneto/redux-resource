import { ResourceApi, ResourceEventHandlers } from './types'
import { createResourceActions, createDynamicResourceActions } from './actions'
import { createReducer, createResourceReducer, createDynamicResourceReducer } from './reducers'
import { createResourceSagas, createDynamicResourceSagas, createEffects, getTypeToSagaMap } from './sagas'

const createResource = (namespace: string, api: ResourceApi, sagasOnSuccessHandlers?: ResourceEventHandlers) => {
  const { actions, types } = createResourceActions(namespace)
  const reducers = createResourceReducer(types)
  const sagas = createResourceSagas(actions, types, api, sagasOnSuccessHandlers)

  return { actions, types, reducers, sagas }
}

const createDynamicResource = (namespace: string, api: ResourceApi, sagasOnSuccessHandlers?: ResourceEventHandlers) => {
  const { actions, types } = createDynamicResourceActions(namespace)
  const reducers = createDynamicResourceReducer(types)
  const sagas = createDynamicResourceSagas(actions, types, api, sagasOnSuccessHandlers)

  return { actions, types, reducers, sagas }
}

export default createResource
export * from './status'
export * from './types'
export {
  createResourceActions,
  createReducer,
  createResourceReducer,
  createResourceSagas,
  createEffects,
  getTypeToSagaMap,
}
