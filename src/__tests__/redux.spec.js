import { createResourceActions } from '../actions'
import { createResourceReducer } from '../reducers'
import { IN_PROGRESS, SUCCESS, ERROR } from '../constants/status'

const initialState = {
  loadStatus: null,
  createStatus: null,
  updateStatus: null,
  removeStatus: null,
  loadError: null,
  createError: null,
  updateError: null,
  removeError: null,
  data: null,
}

describe('Create Resource Reducers', () => {
  it('should return initial state', () => {
    const { types } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(undefined, {})
    expect(state).toEqual(initialState)
  })

  it('should return initial state with additional state', () => {
    const { types } = createResourceActions('RESOURCE')
    const additionalState = { custom: true }
    const reducer = createResourceReducer(types, additionalState)
    const expectedState = {
      ...initialState,
      custom: true,
    }
    const state = reducer(undefined, {})
    expect(state).toEqual(expectedState)
  })

  it('should set load in progress', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(initialState, actions.setLoadProgress())
    expect(state.loadStatus).toBe(IN_PROGRESS)
  })

  it('should set load error', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const state = reducer(initialState, actions.setLoadError())
    expect(state.loadStatus).toBe(ERROR)
  })

  it('should set load success', () => {
    const { types, actions } = createResourceActions('RESOURCE')
    const reducer = createResourceReducer(types)
    const data = { id: '123' }
    const state = reducer(initialState, actions.setLoadSuccess(data))
    expect(state.loadStatus).toBe(SUCCESS)
    expect(state.data).toEqual(data)
  })

  it('should insert and set additional action', () => {
    const additionalType = { CUSTOM: 'CUSTOM' }
    const additionalAction = { custom: bool => ({ type: 'CUSTOM', bool }) }
    const additionalInitialState = { custom: false }
    const additionalReducer = { CUSTOM: (state, { bool }) => ({ ...state, custom: bool }) }
    const { types, actions } = createResourceActions('DEFAULT', additionalType, additionalAction)
    const reducer = createResourceReducer(types, additionalInitialState, additionalReducer)
    const initialStateCustom = {
      ...initialState,
      custom: true,
    }
    const state = reducer(initialStateCustom, actions.custom(true))
    expect(state.custom).toBeTruthy()
  })
})
