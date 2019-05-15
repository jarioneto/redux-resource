import createResourceActions from '../../actions/static'
import createResourceReducer from '../../reducers/static'
import { createResourceInitialState } from '../../reducers/utils'
import { Status, Resource, ResourceActions, Operation } from '../../types'
import { capitalize } from 'lodash'

interface Props {
  actionType: keyof ResourceActions,
  operation: Operation,
  status: Status,
  data?: any,
  error?: any,
  initialState?: Resource<any>,
}

const test = ({ actionType, operation, status, data, error, initialState }: Props) => {
  const { types, actions } = createResourceActions('RESOURCE')
  const reducer = createResourceReducer(types)
  const initial = initialState || createResourceInitialState()
  const state = reducer(initial, actions[actionType](data || error))
  expect(state).toStrictEqual({
    ...initial,
    data: data || null,
    [operation]: { status, error: error || null },
  })
}

const createTestSuit = (operation: Operation) => {
  const cap = capitalize(operation)

  it(`should set ${operation} in progress`, () => {
    test({
      actionType: `set${cap}Progress` as keyof ResourceActions,
      operation,
      status: Status.pending
    })
  })

  it(`should set ${operation} error`, () => {
    test({
      actionType: `set${cap}Error` as keyof ResourceActions,
      operation,
      status: Status.error,
      error: { error: 'error' },
    })
  })

  it(`should set ${operation} success`, () => {
    test({
      actionType: `set${cap}Success` as keyof ResourceActions,
      operation,
      status: Status.success,
      data: operation === 'load' ? { test: 'test' } : null,
    })
  })

  it(`should reset ${operation} status`, () => {
    const initialState = {
      ...createResourceInitialState(),
      data: operation === 'load' ? { test: 'test' } : null,
      [operation]: { status: Status.error, error: { message: 'error' } },
    }

    test({
      actionType: `reset${cap}Status` as keyof ResourceActions,
      operation,
      status: Status.pristine,
      initialState,
    })
  })
}

describe('Static resource reducers', () => {
  it('should return initial state', () => {
    const { types } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(undefined, { type: 'NOT_EXIST' })
    expect(state).toEqual(createResourceInitialState())
  })

  createTestSuit('load')
  createTestSuit('create')
  createTestSuit('update')
  createTestSuit('remove')
})
