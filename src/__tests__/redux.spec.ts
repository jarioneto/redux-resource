import { createResourceActions } from '../actions'
import { createResourceReducer, initialState } from '../reducers'
import { Status } from '../types'

describe('Create Resource Reducers', () => {
  it('should return initial state', () => {
    const { types } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(undefined, { type: 'NOT_EXIST' })
    expect(state).toEqual(initialState)
  })

  it('should set load in progress', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(initialState, actions.setLoadProgress())
    expect(state.load.status).toBe(Status.Pending)
  })

  it('should set load error', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(initialState, actions.setLoadError('error'))
    expect(state.load.error).toBe(Status.Error)
  })

  it('should set load success', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const data = { id: '123' }
    const state = reducer(initialState, actions.setLoadSuccess(data))
    expect(state.load.status).toBe(Status.Success)
    expect(state.data).toEqual(data)
  })
})
