import {
  FunctionMap,
  Action,
  SagaTree,
} from '../types'
import { all, takeLatest } from 'redux-saga/effects'
import { forEach, map } from 'lodash'

export function* createEffects(typeToSagaMap: FunctionMap) {
  yield all(map(typeToSagaMap, (saga, type) => takeLatest(type, saga)))
}

export const getTypeToSagaMap = (sagaTree: SagaTree, result: FunctionMap = {}) =>
  forEach(sagaTree, (value, key) => {
    if (typeof value === 'function') result[key] = value // eslint-disable-line
    else getTypeToSagaMap(value, result)
  })

export const missingSagaError = ({ type }: Action) => {
  throw new Error(`Missing saga for resource. No api function has been provided for action ${type}`)
}
