import createResourceActions from '../actions/static'
import createResourceReducer from '../reducers/static'
import { createResourceInitialState } from '../reducers/utils'
import { Status } from '../types'

describe('Create Resource Reducers', () => {
  it('should return initial state', () => {
    const { types } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(undefined, { type: 'NOT_EXIST' })
    expect(state).toEqual(createResourceInitialState())
  })

  it('should set load in progress', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(createResourceInitialState(), actions.setLoadProgress())
    expect(state.load.status).toBe(Status.pending)
  })

  it('should set load error', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(createResourceInitialState(), actions.setLoadError('error'))
    expect(state.load.error).toBe(Status.error)
  })

  it('should set load success', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const data = { id: '123' }
    const state = reducer(createResourceInitialState(), actions.setLoadSuccess(data))
    expect(state.load.status).toBe(Status.success)
    expect(state.data).toEqual(data)
  })
})
