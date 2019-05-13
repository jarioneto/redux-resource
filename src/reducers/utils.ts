import { Status, Resource } from '../types'
import { Action as ActionRedux } from 'redux'

type Handlers<State, Types extends string, Actions extends ActionRedux<Types>> = {
  readonly [Type in Types]: (state: State, action: Actions) => State
}

export const createReducer = <State, Types extends string, Actions extends ActionRedux<Types>>(
  initialState: State,
  handlers: Handlers<State, Types, Actions>,
) => (state = initialState, action: Actions) =>
  handlers.hasOwnProperty(action.type) ? handlers[action.type as Types](state, action) : state

export const createResourceInitialState = (): Resource<any> => ({
  data: null,
  load: { status: Status.pristine, error: null },
  create: { status: Status.pristine, error: null },
  update: { status: Status.pristine, error: null },
  remove: { status: Status.pristine, error: null },
})
