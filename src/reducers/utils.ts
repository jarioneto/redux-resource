import { FunctionMap, Action } from '../types'

export const createReducer = (initialState: Object, actions: FunctionMap) =>
  (state: Object = initialState, action: Action) => {
    const reducer = actions[action.type]

    return reducer ? reducer(state, action) : state
  }
