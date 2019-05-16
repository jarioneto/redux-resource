import createResourceActions from './actions/static'
import createDynamicResourceActions from './actions/dynamic'
import { createReducer } from './reducers/utils'
import createResourceReducer from './reducers/static'
import createDynamicResourceReducer from './reducers/dynamic'
import { createEffects, getTypeToSagaMap } from './sagas/utils'
import createResourceSagas from './sagas/static'
import createDynamicResourceSagas from './sagas/dynamic'
import {
  ResourceApi,
  ResourceEventHandlers,
  DynamicResourceApi,
  DynamicResourceEventHandlers
} from './types'

const createResource = (
  namespace: string,
  api: ResourceApi,
  sagasOnSuccessHandlers?: ResourceEventHandlers
) => {
  const { actions, types } = createResourceActions(namespace)
  const reducer = createResourceReducer(types)
  const sagas = createResourceSagas(actions, types, api, sagasOnSuccessHandlers)

  return { actions, types, reducer, sagas }
}

const createDynamicResource = (
  namespace: string,
  api: DynamicResourceApi,
  sagasOnSuccessHandlers?: DynamicResourceEventHandlers
) => {
  const { actions, types } = createDynamicResourceActions(namespace)
  const reducer = createDynamicResourceReducer(types)
  const sagas = createDynamicResourceSagas(actions, types, api, sagasOnSuccessHandlers)

  return { actions, types, reducer, sagas }
}

export * from './status'
export * from './types'
export {
  createResource,
  createDynamicResource,
  createReducer,
  createEffects,
  getTypeToSagaMap,
}
