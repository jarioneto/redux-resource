import { createResourceActions } from '../actions'
import { capitalize, reduce } from 'lodash'
import { ResourceActions } from 'types'

const testActionCreators = (actionCreators: ResourceActions, namespace: string, type: (keyof ResourceActions)) => {
  const capitalizedType = capitalize(type)
  const upperName = namespace.toUpperCase()
  const upperType = type.toUpperCase()

  // basic action
  let actionObject = actionCreators[type]({ test: 'test' })
  const key = type === 'load' ? 'params' : 'data'
  let expected = { type: `${upperName}/${upperType}`, [key]: { test: 'test' } }
  expect(actionObject).toEqual(expected)

  // // progress
  const progressType = `set${capitalizedType}Progress` as (keyof ResourceActions)
  actionObject = actionCreators[progressType]('data')
  expected = { type: `${upperName}/${upperType}_PROGRESS` }
  expect(actionObject).toEqual(expected)

  // // success
  // const successType = `set${capitalizedType}Success` as (keyof ResourceActions)
  // actionObject = actionCreators[successType]('data')
  // expected = { type: `${upperName}/${upperType}_SUCCESS` }
  // expect(actionObject).toEqual(expected)

  // // error
  // const errorType = `set${capitalizedType}Error` as (keyof ResourceActions)
  // actionObject = actionCreators[errorType]('data')
  // expected = { type: `${upperName}/${upperType}_ERROR` }
  // expect(actionObject).toEqual(expected)

  // // reset
  // const resetType = `reset${capitalizedType}Status` as (keyof ResourceActions)
  // actionObject = actionCreators[resetType]('data')
  // expected = { type: `${upperName}/RESET_${upperType}_STATUS` }
  // expect(actionObject).toEqual(expected)
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
