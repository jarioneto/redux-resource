# Redux Resources

After dealing multiple times with making network requests, setting their state and rendering stuff
according to the state of the request and the data returned from the server, we observed that we
always do basically the same thing. Instead of repeating the same logic over and over again, we
built this library for internal usage at Zup IT. We use this in our projects built with React and
Redux.

Inspired by REST apis, this library abstracts every request as part of a Resource, hence the name.
A resource is an entity with any of the following operations: "load", "create", "update" and
"remove".

A resource can be defined by simply calling `createResource`. See the code below:

```javascript
import { createResource } from '@zup-it/redux-resource'

const profileApi = {
  load: () => axios.get('http://example.com/profile').then(response => response.data),
  update: (data) => axios.get('http://example.com/profile', data).then(response => response.data),
}

export const profile = createResource('PROFILE', profileApi)
```

`profile` in the code above is an object with the properties `{ types, actions, reducers, sagas }`.
You can register the generated reducer to the redux store and the sagas to the saga-middleware:

```javascript
import { profile } from './resources'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createEffects } from '@zup-it/redux-resource'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({ profile: profile.reducers }),
  applyMiddleware(sagaMiddleware),
)

const sagas = function* run() {
  yield createEffects(profile.sagas)
}

sagaMiddleware.run(sagas)

export default store
```

Given you correctly set up the store provider for your application. You can now use the resource in
any react component connected by redux:

```javascript
import react, { PureComponent } from 'react'
import { profile } from './resources'
import { isPristine, isLoading, hasLoadError } from '@zup-it/redux-resource'

class Profile extends PureComponent {
  
  componentDidMount() {
    const { loadProfile } = this.props
    loadProfile()
  }

  render() {
    const { profile } = this.props

    if (isPristine(profile)) return null
    if (isLoading(profile)) return <p>loading...</p>
    if (hasLoadError(profile)) return <p>error!</p>

    const { name, lastName, birthDate, age } = profile.data

    return (
      <h1>Profile</h1>
      <ul>
        <li>Name: {name}</li>
        <li>Last name: {lastName}</li>
        <li>Birth date: {birthDate}</li>
        <li>age: {age}</li>
      </ul>
    )
  }
}

const mapStateToProps = ({ profile }) => ({ profile })
const actions = { loadProfile: profile.actions.load }

export default connect(mapStateToProps, actions)(Profile)
```

In the code above, the profile resource gets injected through the redux connect method. The load
operation is dispatched through the action creator `profile.actions.load` and we check the status
of the request by verifying its status through the helper functions `isPristine` (nothing happened
to the load operation yet), `isLoading`, `hasLoadError` and `hasLoadSuccess`.

To deal with an update to the profile, for instance, we'd use `profile.actions.update` and we'd
check the status through the functions `isUpdating`, `hasUpdateError` and `hasUpdateSuccess`.

By building our application around the concept resources, we were able to create a generic behavior
for every request. With this, we eliminated the need for creating different reducers, types,
actions and sagas, reducing, by a lot, the time needed to implement the functionalities we needed.
Furthermore, we were able to provide a very simple model for declaring and using requests, which
made it much easier to find and debug possible problems.

# Resources

Suppose we need to build a simplified application for selling digital movies. This application will
display the user profile, balance, credit cards, a movie catalog and it will provide an interface
for ordering a movie. The list below describes all resources and their operations we'd need to
create this app:

- Profile: load
- balance: load, update
- creditCard: load, create, remove
- movieCatalog: load
- order: create

Every resource is defined using the following structure:

```javascript
{
  data: any,
  load: { status: Status, error: any | null },
  update: { status: Status, error: any | null },
  create: { status: Status, error: any | null },
  remove: { status: Status, error: any | null },
}
```

`data` corresponds to the payload returned by the api. Each `load`, `update`, `create` and `remove`
corresponds to the state of the request used to load, update, create or remove, respectively. In
this state, `status` can be "pristine" (nothing happened yet), "pending", "success" or "error". The
attribute `error` will be null unless an error ocurred while performing the operation. Otherwise,
`error` will have the exception thrown by the api.

# Installation


# Utilities for checking the operation status

You can use the following functions to test the status of an operation of a resource. Every function
below receives a resource object or undefined and returns a boolean.

| Function name    | Description                                                                               |
|------------------|-------------------------------------------------------------------------------------------|
| isLoadPristine   | true if resource is undefined or `resource.load.status` is "pristine". false otherwise.   |
| isPristine       | alias for isLoadPristine                                                                  |
| isLoading        | true if `resource.load.status` is "progress". false otherwise.                            |
| hasLoadSuccess   | true if `resource.load.status` is "success". false otherwise.                             |
| hasLoadError     | true if `resource.load.status` is "error". false otherwise.                               |
| isCreatePristine | true if resource is undefined or `resource.create.status` is "pristine". false otherwise. |
| isCreating       | true if `resource.create.status` is "progress". false otherwise.                          |
| hasCreateSuccess | true if `resource.create.status` is "success". false otherwise.                           |
| hasCreateError   | true if `resource.create.status` is "error". false otherwise.                             |
| isUpdatePristine | true if resource is undefined or `resource.update.status` is "pristine". false otherwise. |
| isUpdating       | true if `resource.update.status` is "progress". false otherwise.                          |
| hasUpdateSuccess | true if `resource.update.status` is "success". false otherwise.                           |
| hasUpdateError   | true if `resource.update.status` is "error". false otherwise.                             |
| isRemovePristine | true if resource is undefined or `resource.remove.status` is "pristine". false otherwise. |
| isRemoving       | true if `resource.remove.status` is "progress". false otherwise.                          |
| hasRemoveSuccess | true if `resource.remove.status` is "success". false otherwise.                           |
| hasRemoveError   | true if `resource.remove.status` is "error". false otherwise.                             |

# Other utilities

This library also provides three other utility methods: `createReducer`, `createEffects` and
`getTypeToSagaMap`.

## `createReducer(initialState, handlers)`

This is responsible for creating a reducer function from an object where each key is an action type
and each value is a function. The value function receives `(currentState, action)` and returns
the new state.

Say we want to create a reducer for a counter. We'd need three actions: "RESET", "INCREMENT" and
"DECREMENT". The code below shows how we can create the reducer using `createReducer`.

```javascript

const initial = { count: 0 }

const handlers = {
  RESET: state => ({ count: 0 }),
  INCREMENT: (({ count }), { amount }) => ({ count: count + (amount || 1) }),
  DECREMENT: (({ count }), { amount }) => ({ count: count + (amount || 1) }),
}

const reducer = createReducer(initialState, handlers)
```

# Dynamic resources


# Demo projects
