import createResourceActions from '../actions/static'
import { capitalize, reduce } from 'lodash'
import { ResourceActions } from '../types'

type Operation = 'load' | 'create' | 'update' | 'remove'
type Progress = 'setLoadProgress' | 'setCreateProgress' | 'setUpdateProgress' | 'setRemoveProgress'
type Success = 'setLoadSuccess' | 'setCreateSuccess' | 'setUpdateSuccess' | 'setRemoveSuccess'
type Error = 'setLoadError' | 'setCreateError' | 'setUpdateError' | 'setRemoveError'
type Reset = 'resetLoadStatus' | 'resetCreateStatus' | 'resetUpdateStatus' | 'resetRemoveStatus'


const testActionCreators = (actionCreators: ResourceActions, namespace: string, type: Operation) => {
  const capitalizedType = capitalize(type)
  const upperName = namespace.toUpperCase()
  const upperType = type.toUpperCase()

  // basic action
  let actionObject = actionCreators[type]({ test: 'test' })
  const key = type === 'load' ? 'params' : 'data'
  let expected = { type: `${upperName}/${upperType}`, [key]: { test: 'test' } }
  expect(actionObject).toEqual(expected)

  // progress
  const progress = `set${capitalizedType}Progress` as Progress
  actionObject = actionCreators[progress]()
  expected = { type: `${upperName}/${upperType}_PROGRESS` }
  expect(actionObject).toEqual(expected)

  // success
  const success = `set${capitalizedType}Success` as Success
  actionObject = actionCreators[success]()
  expected = { type: `${upperName}/${upperType}_SUCCESS` }
  expect(actionObject).toEqual(expected)

  // error
  const error = `set${capitalizedType}Error` as Error
  actionObject = actionCreators[error]('invalid-field')
  expected = { type: `${upperName}/${upperType}_ERROR`, error: 'invalid-field' }
  expect(actionObject).toEqual(expected)

  // reset
  const reset = `reset${capitalizedType}Status` as Reset
  actionObject = actionCreators[reset]()
  expected = { type: `${upperName}/RESET_${upperType}_STATUS` }
  expect(actionObject).toEqual(expected)
}

const getTypes = (namespace: string, type: string) => {
  const keys = [
    `${type}`,
    `${type}_PROGRESS`,
    `${type}_SUCCESS`,
    `${type}_ERROR`,
    `RESET_${type}_STATUS`,
  ]

  return reduce(keys, (result, key) => ({ ...result, [key]: `${namespace}/${key}` }), {})
}

describe('Create Resource Actions', () => {
  it('should return default actions', () => {
    const { actions } = createResourceActions('DEFAULT')
    testActionCreators(actions, 'DEFAULT', 'load')
    testActionCreators(actions, 'DEFAULT', 'create')
    testActionCreators(actions, 'DEFAULT', 'update')
    testActionCreators(actions, 'DEFAULT', 'remove')
  })

  it('should return default types', () => {
    const { types } = createResourceActions('DEFAULT')
    const expectedTypes = {
      ...getTypes('DEFAULT', 'LOAD'),
      ...getTypes('DEFAULT', 'CREATE'),
      ...getTypes('DEFAULT', 'UPDATE'),
      ...getTypes('DEFAULT', 'REMOVE'),
    }
    expect(types).toEqual(expectedTypes)
  })
})
