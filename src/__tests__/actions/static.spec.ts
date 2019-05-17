import createResourceActions from '../../actions/static'
import { capitalize } from 'lodash'
import {
  ResourceActions,
  Operation,
  PendingAction,
  SuccessAction,
  ErrorAction,
  ResetAction,
} from '../../types'

const testActionCreators = (actionCreators: ResourceActions, namespace: string, type: Operation) => {
  const capitalizedType = capitalize(type)
  const upperName = namespace.toUpperCase()
  const upperType = type.toUpperCase()

  // basic action
  let actionObject = actionCreators[type]({ test: 'test' })
  const key = type === 'load' ? 'params' : 'data'
  let expected = { type: `${upperName}/${upperType}`, [key]: { test: 'test' } }
  expect(actionObject).toEqual(expected)

  // pending
  const pending = `set${capitalizedType}Pending` as PendingAction
  actionObject = actionCreators[pending]()
  expected = { type: `${upperName}/${upperType}_PENDING` }
  expect(actionObject).toEqual(expected)

  // success
  const success = `set${capitalizedType}Success` as SuccessAction
  actionObject = actionCreators[success]()
  expected = { type: `${upperName}/${upperType}_SUCCESS` }
  expect(actionObject).toEqual(expected)

  // error
  const error = `set${capitalizedType}Error` as ErrorAction
  actionObject = actionCreators[error]('invalid-field')
  expected = { type: `${upperName}/${upperType}_ERROR`, error: 'invalid-field' }
  expect(actionObject).toEqual(expected)

  // reset
  const reset = `reset${capitalizedType}Status` as ResetAction
  actionObject = actionCreators[reset]()
  expected = { type: `${upperName}/RESET_${upperType}_STATUS` }
  expect(actionObject).toEqual(expected)
}

describe('Static resource actions', () => {
  it('should return action creators', () => {
    const { actions } = createResourceActions('DEFAULT')
    testActionCreators(actions, 'DEFAULT', 'load')
    testActionCreators(actions, 'DEFAULT', 'create')
    testActionCreators(actions, 'DEFAULT', 'update')
    testActionCreators(actions, 'DEFAULT', 'remove')
  })
})
