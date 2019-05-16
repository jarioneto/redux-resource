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
  load: () => axios.get('https://example.com/profile').then(response => response.data),
  update: (data) => axios.put('https://example.com/profile', data).then(response => response.data),
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

# Installation


# Resources

Suppose we need to build a simplified application for selling digital movies. This application will
display the user profile, balance, credit cards, a movie catalog and it will provide interfaces
for ordering a movie, buying balance, managing credit cards and updating the profile. The list below
describes all resources and their operations we'd need to create for this app:

- Profile: load, update
- Balance: load, update
- Credit card: load, create, remove
- Movie catalog: load
- Order: create

These resources can be created using the following code:

```javascript
import axios from 'axios'
import { createResource } from '@zup-it/redux-resource'

const api = axios.create({ baseURL: 'https://example.com' })

api.interceptors.response.use(response => response.data)

const profileApi = {
  load: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
}

const balanceApi = {
  load: () => axios.get('/balance'),
  update: (data) => axios.put('/balance', data),
}

const creditCardApi = {
  load: () => axios.get('/creditCard'),
  create: (data) => axios.post('/creditCard', data),
  remove: (id) => axios.delete('/creditCard', id),
}

const movieCatalogApi = {
  load: () => api.get('/movieCatalog'),
}

const orderApi = {
  create: () => api.post('/order'),
}

const profile = createResource('PROFILE', profileApi)
const balance = createResource('PROFILE', balanceApi)
const creditCard = createResource('CREDIT_CARD', creditCardApi)
const movieCatalog = createResource('MOVIE_CATALOG', movieCatalogApi)
const order = createResource('ORDER', orderApi)

export default {
  profile,
  balance,
  creditCard,
  movieCatalog,
  order,
}
```

## State of a resource in Redux

Every resource is represented in the redux state by the following structure (Typescript notation):

```javascript
{
  data: any,
  load: { status: Status, error: any | null },
  update: { status: Status, error: any | null },
  create: { status: Status, error: any | null },
  remove: { status: Status, error: any | null },
}
```

`data` corresponds to the values returned by the api. We generally use axios to make our api calls,
but you can use whatever you want, just keep in mind that `data` will receive exactly what is
returned from the api method. Axios, by default, returns the entire response object, with the http
status, request details, payload, etc. We only want the payload. A tip when using axios is to use
a response interceptor that strips everything, but the payload from the response. By doing this,
you can write `api = { load: () => axios.get(url) }` instead of
`api = { load: () => axios.get(url).then(response => response.data) }`.

Each `load`, `update`, `create` and `remove` corresponds to the state of the request used to load,
update, create or remove, respectively. In this state, `status` can be "pristine" (nothing happened
yet), "pending", "success" or "error". The attribute `error` will be null unless an error ocurred
while performing the operation. Otherwise, `error` will have the exception thrown by the api. A
constant named `Status` is exported by the lib if you need to use it.

## Return value of the `createResource` method

Each resource created by the method `createResource` is an object with the properties `types`,
`actions`, `reducers`, `sagas`.

### resource.types

`types` is an object mapping operation name to action type. Example using the namespace `'PROFILE'`:

```javascript
{
  LOAD: 'PROFILE/LOAD',
  LOAD_PROGRESS: 'PROFILE/LOAD_PROGRESS',
  LOAD_SUCCESS: 'PROFILE/LOAD_SUCCESS',
  LOAD_ERROR: 'PROFILE/LOAD_ERROR',
  RESET_LOAD_STATUS: 'PROFILE/RESET_LOAD_STATUS',

  CREATE: 'PROFILE/CREATE',
  CREATE_PROGRESS: 'PROFILE/CREATE_PROGRESS',
  CREATE_SUCCESS: 'PROFILE/CREATE_SUCCESS',
  CREATE_ERROR: 'PROFILE/CREATE_ERROR',
  RESET_CREATE_STATUS: 'PROFILE/RESET_CREATE_STATUS',

  UPDATE: 'PROFILE/UPDATE',
  UPDATE_PROGRESS: 'PROFILE/UPDATE_PROGRESS',
  UPDATE_SUCCESS: 'PROFILE/UPDATE_SUCCESS',
  UPDATE_ERROR: 'PROFILE/UPDATE_ERROR',
  RESET_UPDATE_STATUS: 'PROFILE/RESET_UPDATE_STATUS',

  REMOVE: 'PROFILE/REMOVE',
  REMOVE_PROGRESS: 'PROFILE/REMOVE_PROGRESS',
  REMOVE_SUCCESS: 'PROFILE/REMOVE_SUCCESS',
  REMOVE_ERROR: 'PROFILE/REMOVE_ERROR',
  RESET_REMOVE_STATUS: 'PROFILE/RESET_REMOVE_STATUS',
}
```

### resource.actions

`actions` is an object of action creators: If we create a resource with the namespace `'PROFILE'`,
its actions would be an object with the following functions: `load`, `setLoadProgress`,
`setLoadSuccess`, `setLoadError`, `resetLoadStatus`, `create`, `setCreateProgress`,
`setCreateSuccess`, `setCreateError`, `resetCreateStatus`, `update`, `setUpdateProgress`,
`setUpdateSuccess`, `setUpdateError`, `resetUpdateStatus`, `remove`, `setRemoveProgress`,
`setRemoveSuccess`, `setRemoveError`, `resetRemoveStatus`.

Each of these functions returns an action object ready to be dispatched by redux. The functions
`load`, `create`, `update` and `remove` can receive one parameter which is passed to the
corresponding api method.

`load`, `create`, `update` and `remove` are used to start an operation on the resource. All action
creators starting with `set` are used by the sagas which are automatically generated by the
`createResource` method. You shouldn't use them unless you have a really good reason too (e.g.
altering a default saga). The action creators starting with `reset` can be used to reset the status
of an operation to `pristine` and remove any error information. `resetLoadStatus` also wipes the
contents of `data`.

### resource.reducers

`reducers` is the reducer function that must be provided to redux when creating the store. It
receives the current state and an action, returning a new state.

To register the reducers to the store, you can use the following code when creating the store:

```javascript
import resources from './resources'
import { createStore, applyMiddleware, combineReducers } from 'redux'

...

const reducers = combineReducers({
  profile: resources.profile.reducers,
  balance: resources.balance.reducers,
  creditCard: resources.creditCard.reducers,
  movieCatalog: resources.movieCatalog.reducers,
  order: resources.order.reducers,
})

...

const store = createStore(reducers, applyMiddleware(sagaMiddleware)) // sagas are explained in the next section

export default store
```

### resource.sagas

`sagas` is an object mapping action type to saga generator function. Although it's not needed for
a simple usage of this library, if you want to know more about saga generator functions, we
recommend reading the [redux-saga documentation](https://github.com/redux-saga/redux-saga).

If we use `createResource` to create a resource with the namespace 'PROFILE', for instance, the
`sagas` property of the resulting object would have the keys: `PROFILE/LOAD`, `PROFILE/UPDATE`,
`PROFILE/CREATE` and `PROFILE/LOAD`. The value for each key would be the corresponding saga
generator function.

These functions should be provided to the saga middleware when creating the store. See the example
below:

```javascript
import resources from './resources'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createEffects } from '@zup-it/redux-resource'

...

const sagas = function* run() {
  yield createEffects({
    ...resources.catalog.sagas,
    ...resources.order.sagas,
    ...resources.profile.sagas,
    ...resources.wallet.sagas,
  })
}

const store = createStore(reducers, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(sagas)
export default store
```

In the code above we used `createEffects` which is an utility function provided by our lib that
takes an object relating action types to sagas and creates a root saga function. For further
details on this function, please read the section "Other utilities".

## `onSuccess`: the third and optional parameter of `createResource`

The function `createResource` can be passed a third parameter, which is the `onSuccess` handlers.
Sometimes it is necessary to perform further actions after an operation succeeds, in these cases,
you can use the `onSuccess` parameter to complement a saga instead of completely rewriting it.

To use this feature, it is advised some basic knowledge of redux-saga. Check their documentation
at https://github.com/redux-saga/redux-saga.

Let's take the example we used before: a simple store to sell digital movies. The user has a
balance, which is shown all the time in the header of the page. After the user places an order with
his/her balance, the value of the balance will have decreased, but it won't be reflected in our
application, because we didn't update the resource "balance" yet.

Through the `onSuccess` handler we can say that after every successful order, the balance must be
fetched again. See the example below:

```javascript
import { createResource } from '@zup-it/redux-resource'
import { put } from 'redux-saga/effects'

...

const balance = createResource('PROFILE', balanceApi)

function* onOrderSuccess() {
  yield put(balance.actions.load())
}

const order = createResource('ORDER', orderApi, { create: onOrderSuccess })
```

Alternatively, instead of reloading the balance, you could have changed its value according to
the value of the order:

```javascript
function* onOrderSuccess({ requestData: order }) {
  const currentBalance = yield select(state => state.balance.data)
  const newValue = currentBalance.value - order.value
  yield put(balance.actions.setLoadSuccess({ ...currentBalance, value: newValue }))
}
```

An onSuccess handler will always receive as parameter an object containing the keys `requestData`
and `responseData`. The value of `requestData` is the parameter passed when calling the
actionCreator `load`, `create`, `update` or `remove`. The value of `responseData` is the return
value of the api method.

# Utilities for checking the operation status

You can use the following functions to test the status of an operation of a resource. Every function
below receives a resource object or undefined and returns a boolean.

| Function name    | Description                                                                                                                                              |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| isLoadPristine   | Verifies if the the load operation has not been started yet. True if resource is undefined or `resource.load.status` is "pristine". false otherwise.     |
| isPristine       | alias for isLoadPristine                                                                                                                                 |
| isLoading        | Verifies if the the load operation is in progress. True if `resource.load.status` is "progress". false otherwise.                                        |
| hasLoadSuccess   | Verifies if the the load operation has succeeded. True if `resource.load.status` is "success". false otherwise.                                          |
| hasLoadError     | Verifies if the the load operation had an error. True if `resource.load.status` is "error". false otherwise.                                             |
| isCreatePristine | Verifies if the the create operation has not been started yet. True if resource is undefined or `resource.create.status` is "pristine". false otherwise. |
| isCreating       | Verifies if the the create operation is in progress. True if `resource.create.status` is "progress". false otherwise.                                    |
| hasCreateSuccess | Verifies if the the create operation has succeeded. True if `resource.create.status` is "success". false otherwise.                                      |
| hasCreateError   | Verifies if the the create operation had an error. True if `resource.create.status` is "error". false otherwise.                                         |
| isUpdatePristine | Verifies if the the update operation has not been started yet. True if resource is undefined or `resource.update.status` is "pristine". false otherwise. |
| isUpdating       | Verifies if the the update operation is in progress. True if `resource.update.status` is "progress". false otherwise.                                    |
| hasUpdateSuccess | Verifies if the the update operation has succeeded. True if `resource.update.status` is "success". false otherwise.                                      |
| hasUpdateError   | Verifies if the the update operation had an error. True if `resource.update.status` is "error". false otherwise.                                         |
| isRemovePristine | Verifies if the the remove operation has not been started yet. True if resource is undefined or `resource.remove.status` is "pristine". false otherwise. |
| isRemoving       | Verifies if the the remove operation is in progress. True if `resource.remove.status` is "progress". false otherwise.                                    |
| hasRemoveSuccess | Verifies if the the remove operation has succeeded. True if `resource.remove.status` is "success". false otherwise.                                      |
| hasRemoveError   | Verifies if the the remove operation ha an error. True if `resource.remove.status` is "error". false otherwise.                                          |

# Other utilities

This library also provides three other utility methods: `createEffects`, `getTypeToSagaMap` and
`createReducer`.

## `createEffects(typeToSagaMap)`



## `getTypeToSagaMap(sagaTree)`



## `createReducer(initialState, handlers)`

This function has nothing to do with creating a resource. It is used internally by the library and
we expose it because it's very helpful when creating any kind of reducer. It creates a reducer
function from an object where each key is an action type and each value is a function. The functions
receive `(currentState, action)` and returns the new state.

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
