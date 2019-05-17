# Redux Resource

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

const profile = createResource('PROFILE', profileApi)

export default { profile }
```

`profile` in the code above is an object with the properties `{ types, actions, reducer, sagas }`.
You can register the generated reducer to the redux store and the sagas to the saga-middleware:

```javascript
import resources from './resources'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createEffects } from '@zup-it/redux-resource'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({ profile: resources.profile.reducer }),
  applyMiddleware(sagaMiddleware),
)

const sagas = function* run() {
  yield createEffects(resources.profile.sagas)
}

sagaMiddleware.run(sagas)

export default store
```

Given you correctly set up the store provider for your application. You can now use the resource in
any react component connected by redux:

```javascript
import react, { PureComponent } from 'react'
import resources from './resources'
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
const actions = { loadProfile: resources.profile.actions.load }

export default connect(mapStateToProps, actions)(Profile)
```

In the code above, the resource "profile" gets injected through the redux connect method. The load
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

```
yarn add @zup-it/redux-resource
```

or

```
npm install @zup-next/redux-resource
```

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
`actions`, `reducer`, `sagas`.

### resource.types

`types` is an object mapping operation name to action type. Example using the namespace `'PROFILE'`:

```javascript
{
  LOAD: 'PROFILE/LOAD',
  LOAD_PENDING: 'PROFILE/LOAD_PENDING',
  LOAD_SUCCESS: 'PROFILE/LOAD_SUCCESS',
  LOAD_ERROR: 'PROFILE/LOAD_ERROR',
  RESET_LOAD_STATUS: 'PROFILE/RESET_LOAD_STATUS',

  CREATE: 'PROFILE/CREATE',
  CREATE_PENDING: 'PROFILE/CREATE_PENDING',
  CREATE_SUCCESS: 'PROFILE/CREATE_SUCCESS',
  CREATE_ERROR: 'PROFILE/CREATE_ERROR',
  RESET_CREATE_STATUS: 'PROFILE/RESET_CREATE_STATUS',

  UPDATE: 'PROFILE/UPDATE',
  UPDATE_PENDING: 'PROFILE/UPDATE_PENDING',
  UPDATE_SUCCESS: 'PROFILE/UPDATE_SUCCESS',
  UPDATE_ERROR: 'PROFILE/UPDATE_ERROR',
  RESET_UPDATE_STATUS: 'PROFILE/RESET_UPDATE_STATUS',

  REMOVE: 'PROFILE/REMOVE',
  REMOVE_PENDING: 'PROFILE/REMOVE_PENDING',
  REMOVE_SUCCESS: 'PROFILE/REMOVE_SUCCESS',
  REMOVE_ERROR: 'PROFILE/REMOVE_ERROR',
  RESET_REMOVE_STATUS: 'PROFILE/RESET_REMOVE_STATUS',
}
```

### resource.actions

`actions` is an object of action creators: If we create a resource with the namespace `'PROFILE'`,
its actions would be an object with the following functions: `load`, `setLoadPending`,
`setLoadSuccess`, `setLoadError`, `resetLoadStatus`, `create`, `setCreatePending`,
`setCreateSuccess`, `setCreateError`, `resetCreateStatus`, `update`, `setUpdatePending`,
`setUpdateSuccess`, `setUpdateError`, `resetUpdateStatus`, `remove`, `setRemovePending`,
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

### resource.reducer

`reducer` is the reducer function that must be provided to redux when creating the store. It
receives the current state and an action, returning a new state.

To register the reducers to the store, you can use the following code when creating the store:

```javascript
import resources from './resources'
import { createStore, applyMiddleware, combineReducers } from 'redux'

...

const reducer = combineReducers({
  profile: resources.profile.reducer,
  balance: resources.balance.reducer,
  creditCard: resources.creditCard.reducer,
  movieCatalog: resources.movieCatalog.reducer,
  order: resources.order.reducer,
})

...

const store = createStore(reducer, applyMiddleware(sagaMiddleware)) // sagas are explained in the next section

export default store
```

If you're using [lodash](https://lodash.com/docs/), it would be shorter to write:

```javascript
const reducer = combineReducers(mapValues(resources, 'reducer'))
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

const rootSaga = function* run() {
  yield createEffects({
    ...resources.catalog.sagas,
    ...resources.order.sagas,
    ...resources.profile.sagas,
    ...resources.wallet.sagas,
  })
}

const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)
export default store
```

In the code above we used `createEffects` which is an utility function provided by our lib that
takes an object relating action types to sagas and creates a root saga function. For further
details on this function, please read the section "Other utilities".

If you're using [lodash](https://lodash.com/docs/), it would be shorter to write:

```javascript
const rootSaga = function* run() {
  yield createEffects(getTypeToSagaMap(mapValues(resources, 'sagas')))
}
```

`getTypeToSagaMap` is also an utility function provided by our library. For more details on it,
please read the section "Other utilities".

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
| isLoading        | Verifies if the the load operation is pending. True if `resource.load.status` is "pending". false otherwise.                                        |
| hasLoadSuccess   | Verifies if the the load operation has succeeded. True if `resource.load.status` is "success". false otherwise.                                          |
| hasLoadError     | Verifies if the the load operation had an error. True if `resource.load.status` is "error". false otherwise.                                             |
| isCreatePristine | Verifies if the the create operation has not been started yet. True if resource is undefined or `resource.create.status` is "pristine". false otherwise. |
| isCreating       | Verifies if the the create operation is pending. True if `resource.create.status` is "pending". false otherwise.                                    |
| hasCreateSuccess | Verifies if the the create operation has succeeded. True if `resource.create.status` is "success". false otherwise.                                      |
| hasCreateError   | Verifies if the the create operation had an error. True if `resource.create.status` is "error". false otherwise.                                         |
| isUpdatePristine | Verifies if the the update operation has not been started yet. True if resource is undefined or `resource.update.status` is "pristine". false otherwise. |
| isUpdating       | Verifies if the the update operation is pending. True if `resource.update.status` is "pending". false otherwise.                                    |
| hasUpdateSuccess | Verifies if the the update operation has succeeded. True if `resource.update.status` is "success". false otherwise.                                      |
| hasUpdateError   | Verifies if the the update operation had an error. True if `resource.update.status` is "error". false otherwise.                                         |
| isRemovePristine | Verifies if the the remove operation has not been started yet. True if resource is undefined or `resource.remove.status` is "pristine". false otherwise. |
| isRemoving       | Verifies if the the remove operation is pending. True if `resource.remove.status` is "pending". false otherwise.                                    |
| hasRemoveSuccess | Verifies if the the remove operation has succeeded. True if `resource.remove.status` is "success". false otherwise.                                      |
| hasRemoveError   | Verifies if the the remove operation ha an error. True if `resource.remove.status` is "error". false otherwise.                                          |

# Other utilities

This library also provides three other utility methods: `createEffects`, `getTypeToSagaMap` and
`createReducer`.

## `createEffects(typeToSagaMap, [effect])`

This function facilitates the creation of a root saga to pass to the redux-saga middleware. It
receives an object relating each action type its corresponding saga and transforms it into a
generator function that takes all the provided sagas with the effect passed as parameter. The
default effect is `takeEvery`.

Example:
```javascript
import { createEffects } from '@zup-it/redux-resource'
...

const rootSaga = function* run() {
  yield createEffects({
    'PROFILE/LOAD': loadProfileSaga,
    'PROFILE/UPDATE': updateProfileSaga,
    'PRODUCT/LOAD': loadProductSaga,
  })
}

```

## `getTypeToSagaMap(sagaTree)`

Generally, when using resources, you'll end up with structure like the following:
`resources = { resource1, resource2, resource3, resource4 }`. To register all sagas you'd have to
write something like:

```javascript
const rootSaga = function* run() {
  yield createEffects({
    ...resources.resource1.sagas,
    ...resources.resource2.sagas,
    ...resources.resource3.sagas,
    ...resources.resource4.sagas,
  })
}
```

If you have many sagas, it can become very repetitive to write all this. You could use
[lodash](https://lodash.com/docs/) to map `resources` directly to sagas and then use
`getTypeToSagaMap` to transform the resulting saga tree in a map that relates action type to saga
generator function.

We call a saga tree, any object following the format (typescript):
```javascript
interface SagaTree {
  [key: string]: (() => any) | SagaTree,
}
```

To write the root saga in a single line, we could combine lodash's `mapValues` and
`getTypeToSagaMap`. See the example below:

```javascript
const rootSaga = function* run() {
  yield createEffects(getTypeToSagaMap(mapValues(resources, 'sagas')))
}
```

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
For most cases using `createResource` will be enough and you should always prefer it to
`createDynamicResource`. But, sometimes, the static nature of a common resource will prevent you
from implementing some functionalities.

Suppose you want to create a lazily loaded list of movies. At first, you fetch the list of movies,
but this list doesn't come with all the properties of the movies, just some basic information like
id and title. By clicking an item in the list, it fetches all the properties of the movie clicked,
expands itself and shows the information. If the common resource is used, when a movie is fetched,
it replaces the data of the previous movie, making it impossible to display information about two
movies at the same time.

Common resources are static, it means that they can't have instances. If a load operation is
triggered, the content of the previous load is replaced. It's not possible to separately
track different load, create, update remove operations, because, in fact, there can be only one of
each.

Using the movies example, a movie is fetched through the url `https://example.com/movie/{id}`. The
id is generated dynamically, at runtime, and we want to track each movie as a separate resource. We
must be able to differentiate the data and the operations status of each movie. `movie/1`, for
instance, could have its load status as "pending", while `movie/2` has its load status as "success".

In this case, we say "movie" is a dynamic resource, and it must be created via the
`createDynamicResource` method. See the example below:

```javascript
import { createResource, createDynamicResource } from 

const movieListApi = {
  load: () => axios.get(`https://example.com/movies`).then(response => response.data)
}

const movieApi = {
  load: id => axios.get(`https://example.com/movie/${id}`).then(response => response.data)
}

const movieList = createResource('MOVIE_LIST', movieListApi)
const movie = createDynamicResource('MOVIE', movieApi)

export default { movieList, movie }
```

A dynamic resource works almost exactly like a common resource. The only differences are:

- Every api method receives the id as its first parameter and a data object as second parameter;
- Every action creator must receive an id as its first parameter. `load`, for instance must be
passed an id.
- The redux state is no longer a resource. Instead, it is an object where every key is an id and
its value is a resource.

Inside a component, different movies can be loaded like the following:

```javascript
import resources from './resources'

function MyComponent({ loadMovie }) {
  loadMovie('id001')
  loadMovie('id002')
}

export default connect(null, { loadMovie: resources.movie.load })(MyComponent)
```

You can check the operation status by checking the redux state:

```javascript
import { isLoading } from '@zup-it/redux-resource'

function MyComponent({ movie }) {
  if (isLoading(movie['id001'])) return <p>Loading movie with id = "id001"</p>
  if (isLoading(movie['id002'])) return <p>Loading movie with id = "id002"</p>
}

const mapStateToProps = ({ movie }) => ({ movie })

export default connect(mapStateToProps)(MyComponent)
```

You can use the data of a movie by using the value of `data` inside your `resource.id`:

```javascript
function MyComponent({ movie }) {
  <p>Description of movie id001: {movie['id001'].data.description}</p>
  <p>Description of movie id002: {movie['id002'].data.description}</p>
}

const mapStateToProps = ({ movie }) => ({ movie })

export default connect(mapStateToProps)(MyComponent)
```

# Types
This library is written in Typescript. If you don't use it, it's fine, all the code is transpiled
to common js. But, if you do use Typescript, you can take advantage of all the types we already
defined!

Every function provided by the library had its types declared and you don't need to worry about it.
Although, it is important to know the following types to correctly type your components:

- `Resource<any>`: it is the type of a resource in the redux state. You can pass your data type
inside the generics. Example: `Resource<Movie>`.
- `DynamicResource<any>`: same as the previous, but it declares a dynamic resource instead.
- `Status`: an enum containing any possible status of an operation: `pristine`, `pending`, `success`
or `error`.

See an example below:

```javascript
import { Resource } from '@zup-it/redux-resource'
import { Profile } from './my-data-types'

interface Props {
  loadProfile: () => void,
  profile: Resource<Profile>,
}

class MyComponent extends PureComponent<Props> {
  ...
}

const mapStateToProps = ({ profile }) => ({ profile })
const actions = { loadProfile: resources.profile.actions.load }

export default connect(mapStateToProps, actions)(MyComponent)
```

# Demo projects

We have some simple projects to demonstrate how the library works. They are:

- [demo-simple](https://github.com/Tiagoperes/react-blockbuster/tree/master/demo-simple): a simple
react application in javascript, without any kind of typing. The application is a store for selling
digital movies.
- [demo-dynamic-resource](https://github.com/Tiagoperes/react-blockbuster/tree/master/demo-dynamic-resource):
a project that lists movies and fetches the details of a movie when it's clicked. It's written in
javascript (without typing) and it's an example of how to use a dynamic resource.
- [demo-typescript](https://github.com/Tiagoperes/react-blockbuster/tree/master/demo-typescript):
it's the same project presented in "demo-simple", but written in Typescript.
