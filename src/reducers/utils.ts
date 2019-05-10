import { FunctionMap, Action, Resource } from '../types'
import { status } from '../status'

export const createReducer = (initialState: Object, actions: FunctionMap) =>
  (state: Object = initialState, action: Action) => {
    const reducer = actions[action.type]

    return reducer ? reducer(state, action) : state
  }

export const createResourceInitialState = (): Resource<any> => ({
  data: null,
  load: { status: status.pristine, error: null },
  create: { status: status.pristine, error: null },
  update: { status: status.pristine, error: null },
  remove: { status: status.pristine, error: null },
})
