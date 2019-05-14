import { createResourceInitialState, createReducer } from '../../reducers/utils'
import { Status } from '../../types'
import { AnyAction } from 'redux'

describe('Reducer utilities', () => {
  it('should create resource initial state', () => {
    const state1 = createResourceInitialState()
    const state2 = createResourceInitialState()
    const expected = {
      data: null,
      load: { status: Status.pristine, error: null },
      create: { status: Status.pristine, error: null },
      update: { status: Status.pristine, error: null },
      remove: { status: Status.pristine, error: null },
    }
    expect(state1 !== state2).toBe(true)
    expect(state1).toEqual(expected)
    expect(state2).toEqual(expected)
  })

  it('should create reducer', () => {
    type State = { status: string, data: any, other: string }

    const initial: State = { status: 'pristine', data: null, other: 'test' }
    const reducerMap = {
      LOAD: (state: State) => ({ ...state,  status: 'loading' }),
      SUCCESS: (state: State, { data }: AnyAction) => ({ ...state, data, status: 'success' }),
    }
    const reducer = createReducer(initial, reducerMap)

    let result = reducer(initial, { type: 'LOAD' })
    expect(result).toEqual({ status: 'loading', data: null, other: 'test' })

    result = reducer(initial, { type: 'SUCCESS', data: 'data' })
    expect(result).toEqual({ status: 'success', data: 'data', other: 'test' })

    result = reducer(initial, { type: 'NON_EXISTENT' })
    expect(result).toEqual({ status: 'pristine', data: null, other: 'test' })
  })
})
