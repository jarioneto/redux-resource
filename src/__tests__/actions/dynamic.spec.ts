import createDynamicResourceActions from '../../actions/dynamic'
import { capitalize } from 'lodash'
import {
  DynamicResourceActions,
  Operation,
  ProgressAction,
  SuccessAction,
  ErrorAction,
  ResetAction,
} from '../../types'

const testActionCreators = (actionCreators: DynamicResourceActions, id: string, namespace: string, type: Operation) => {
  const capitalizedType = capitalize(type)
  const upperName = namespace.toUpperCase()
  const upperType = type.toUpperCase()

  // basic action
  let actionObject = actionCreators[type](id, { test: 'test' })
  const key = type === 'load' ? 'params' : 'data'
  let expected = { type: `${upperName}/${upperType}`, id, [key]: { test: 'test' } }
  expect(actionObject).toEqual(expected)

  // progress
  const progress = `set${capitalizedType}Progress` as ProgressAction
  actionObject = actionCreators[progress](id)
  expected = { type: `${upperName}/${upperType}_PROGRESS`, id }
  expect(actionObject).toEqual(expected)

  // success
  const success = `set${capitalizedType}Success` as SuccessAction
  actionObject = actionCreators[success](id)
  expected = { type: `${upperName}/${upperType}_SUCCESS`, id }
  expect(actionObject).toEqual(expected)

  // error
  const error = `set${capitalizedType}Error` as ErrorAction
  actionObject = actionCreators[error](id, 'invalid-field')
  expected = { type: `${upperName}/${upperType}_ERROR`, id, error: 'invalid-field' }
  expect(actionObject).toEqual(expected)

  // reset
  const reset = `reset${capitalizedType}Status` as ResetAction
  actionObject = actionCreators[reset](id)
  expected = { type: `${upperName}/RESET_${upperType}_STATUS`, id }
  expect(actionObject).toEqual(expected)
}

describe('Dynamic resource actions', () => {
  it('should return action creators', () => {
    const { actions } = createDynamicResourceActions('DEFAULT')
    testActionCreators(actions, '001', 'DEFAULT', 'load')
    testActionCreators(actions, '001', 'DEFAULT', 'create')
    testActionCreators(actions, '001', 'DEFAULT', 'update')
    testActionCreators(actions, '001', 'DEFAULT', 'remove')
  })
})
