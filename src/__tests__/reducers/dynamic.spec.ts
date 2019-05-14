import createDynamicResourceActions from '../../actions/dynamic'
import createDynamicResourceReducer from '../../reducers/dynamic'
import { createResourceInitialState } from '../../reducers/utils'
import { Status, DynamicResource, ResourceActions, Operation } from '../../types'
import { capitalize } from 'lodash'

interface Props {
  actionType: keyof ResourceActions,
  operation: Operation,
  status: Status,
  data?: any,
  error?: any,
  initialState?: DynamicResource<any>,
}

const test = ({ actionType, operation, status, data, error, initialState }: Props) => {
  const { types, actions } = createDynamicResourceActions('RESOURCE')
  const reducer = createDynamicResourceReducer(types)
  const initial = initialState || { id001: createResourceInitialState() }
  const state = reducer(initial, actions[actionType]('id002', data || error))
  expect(state).toStrictEqual({
    ...initial,
    id002: {
      ...createResourceInitialState(),
      data: data || null,
      [operation]: { status, error: error || null },
    },
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
    const loadedResourceWithError = {
      ...createResourceInitialState(),
      data: operation === 'load' ? { test: 'test' } : null,
      [operation]: { status: Status.error, error: { message: 'error' } },
    }
    const initialState = {
      id001: { ...loadedResourceWithError },
      id002: { ...loadedResourceWithError }
    }

    test({
      actionType: `reset${cap}Status` as keyof ResourceActions,
      operation,
      status: Status.pristine,
      initialState,
    })
  })
}

describe('Dynamic resource reducers', () => {
  it('should return initial state', () => {
    const { types } = createDynamicResourceActions('RESOURCE')
    const reducer = createDynamicResourceReducer(types)
    const state = reducer(undefined, { type: 'NOT_EXIST' })
    expect(state).toEqual({})
  })

  createTestSuit('load')
  createTestSuit('create')
  createTestSuit('update')
  createTestSuit('remove')
})
