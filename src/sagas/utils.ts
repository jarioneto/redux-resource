import {
  FunctionMap,
  Action,
  SagaTree,
} from '../types'
import { all, takeEvery } from 'redux-saga/effects'
import { forEach, map } from 'lodash'

export function* createEffects (typeToSagaMap: FunctionMap, effect = takeEvery) {
  yield all(map(typeToSagaMap, (saga, type) => effect(type, saga)))
}

export const getTypeToSagaMap = (sagaTree: SagaTree, result: FunctionMap = {}) => {
  forEach(sagaTree, (value, key) => {
    if (typeof value === 'function') result[key] = value // eslint-disable-line
    else getTypeToSagaMap(value, result)
  })

  return result
}

export const createMissingSagaWarning = ({ type }: Action) => {
  const msg = `Warning: missing saga for resource. No api function has been provided for action ${type}`
  console.log(`%c${msg}`, 'color: red')
}
