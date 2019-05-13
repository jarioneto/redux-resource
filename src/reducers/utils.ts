import { Status, FunctionMap, Action, Resource } from '../types'

export const createReducer = (initialState: Object, actions: FunctionMap) =>
  (state: Object = initialState, action: Action) => {
    const reducer = actions[action.type]

    return reducer ? reducer(state, action) : state
  }

export const createResourceInitialState = (): Resource<any> => ({
  data: null,
  load: { status: Status.pristine, error: null },
  create: { status: Status.pristine, error: null },
  update: { status: Status.pristine, error: null },
  remove: { status: Status.pristine, error: null },
})
