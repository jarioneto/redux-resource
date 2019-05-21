import * as staticResourceActions from '../actions/static'
import * as staticResourceReducer from '../reducers/static'
import * as staticResourceSagas from '../sagas/static'
import * as dynamicResourceActions from '../actions/dynamic'
import * as dynamicResourceReducer from '../reducers/dynamic'
import * as dynamicResourceSagas from '../sagas/dynamic'
import { set, keys, difference } from 'lodash'
import * as lib from '../'

// mocks
const originals = {
  createStaticResourceActions: staticResourceActions.default,
  createStaticResourceReducer: staticResourceReducer.default,
  createStaticResourceSagas: staticResourceSagas.default,
  createDynamicResourceActions: dynamicResourceActions.default,
  createDynamicResourceReducer: dynamicResourceReducer.default,
  createDynamicResourceSagas: dynamicResourceSagas.default,
}

const actions = { test: jest.fn() }
const types = { TEST: 'TEST' }
const reducer = jest.fn()
const sagas = { testSaga: jest.fn() }

set(staticResourceActions, 'default', jest.fn(() => ({ actions, types })))
set(staticResourceReducer, 'default', jest.fn(() => reducer))
set(staticResourceSagas, 'default', jest.fn(() => sagas))
set(dynamicResourceActions, 'default', jest.fn(() => ({ actions, types })))
set(dynamicResourceReducer, 'default', jest.fn(() => reducer))
set(dynamicResourceSagas, 'default', jest.fn(() => sagas))

const unmock = () => {
  set(staticResourceActions, 'default', originals.createStaticResourceActions)
  set(staticResourceReducer, 'default', originals.createStaticResourceReducer)
  set(staticResourceSagas, 'default', originals.createStaticResourceSagas)
  set(dynamicResourceActions, 'default', originals.createDynamicResourceActions)
  set(dynamicResourceReducer, 'default', originals.createDynamicResourceReducer)
  set(dynamicResourceSagas, 'default', originals.createDynamicResourceSagas)
}
// end mocks

describe('Lib interface', () => {
  afterAll(unmock)

  it('should create resource', () => {
    const namespace = 'RESOURCE'
    const api = { load: jest.fn() }
    const onSuccess = { load: jest.fn() }
    const resource = lib.createResource(namespace, api, onSuccess)

    expect(staticResourceActions.default).toHaveBeenCalledWith(namespace)
    expect(staticResourceReducer.default).toHaveBeenCalledWith(types)
    expect(staticResourceSagas.default).toHaveBeenCalledWith(actions, types, api, onSuccess)
    expect(resource).toEqual({ types, actions, reducer, sagas })
  })

  it('should create dynamic resource', () => {
    const namespace = 'RESOURCE'
    const api = { load: jest.fn() }
    const onSuccess = { load: jest.fn() }
    const resource = lib.createDynamicResource(namespace, api, onSuccess)

    expect(dynamicResourceActions.default).toHaveBeenCalledWith(namespace)
    expect(dynamicResourceReducer.default).toHaveBeenCalledWith(types)
    expect(dynamicResourceSagas.default).toHaveBeenCalledWith(actions, types, api, onSuccess)
    expect(resource).toEqual({ types, actions, reducer, sagas })
  })

  it('should export', () => {
    // DO NOT ALTER THIS LIST WITHOUT ALTERING THE DOCS!
    const expected = [
      'createResource',
      'createDynamicResource',
      'createReducer',
      'createResourceInitialState',
      'createEffects',
      'getTypeToSagaMap',
      'isLoadPristine',
      'isPristine',
      'isLoading',
      'hasLoadSuccess',
      'hasLoadError',
      'isCreatePristine',
      'isCreating',
      'hasCreateSuccess',
      'hasCreateError',
      'isUpdatePristine',
      'isUpdating',
      'hasUpdateSuccess',
      'hasUpdateError',
      'isRemovePristine',
      'isRemoving',
      'hasRemoveSuccess',
      'hasRemoveError',
      'Status',
    ]

    expect(difference(keys(lib), expected).length).toBe(0)
    expect(difference(expected, keys(lib)).length).toBe(0)
  })
})
