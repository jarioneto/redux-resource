import createDynamicResourceActions from '../../actions/dynamic'
import * as sagaUtils from '../../sagas/utils'
import { set } from 'lodash'
import createDynamicResourceSagas from '../../sagas/dynamic'
import { call, put } from 'redux-saga/effects'
import {
  FunctionMap,
  ResourceTypes,
  Operation,
  PendingAction,
  SuccessAction,
  ErrorAction,
} from '../../types'

// mocking sagaUtils
const originalWarning = sagaUtils.createMissingSagaWarning
set(sagaUtils, 'createMissingSagaWarning', jest.fn())
const unmock = () => set(sagaUtils, 'createMissingSagaWarning', originalWarning)
// end mock

describe('Saga', () => {
  let api: FunctionMap
  let onSuccess: FunctionMap

  beforeEach(() => {
    api = {
      load: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }

    onSuccess = {
      load: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }
  })

  afterAll(unmock)

  const testModifySuccess = (
    operation: Operation,
    setPendingKey: PendingAction,
    setSuccessKey: SuccessAction,
  ) => {
    const { actions, types } = createDynamicResourceActions('DEFAULT')
    const setPending = actions[setPendingKey]
    const setSuccess = actions[setSuccessKey]
    const sagas = createDynamicResourceSagas(actions, types, api, onSuccess)
    const data = { name: 'John' }
    const type = types[operation.toUpperCase() as keyof ResourceTypes]
    const id = 'id001'
    const saga = sagas[type]({ type, id, data })
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setPending(id)))
    expect(saga.next().value).toEqual(call(api[operation], id, data))
    expect(saga.next(response).value).toEqual(put(setSuccess(id)))
    saga.next()
    expect(onSuccess[operation]).toHaveBeenCalledWith({ id, requestData: data, responseData: response })
    expect(saga.next().done).toBeTruthy()
  }

  const testModifyError = (
    operation: Operation,
    setPendingKey: PendingAction,
    setErrorKey: ErrorAction,
  ) => {
    const { actions, types } = createDynamicResourceActions('DEFAULT')
    const setPending = actions[setPendingKey]
    const setError = actions[setErrorKey]
    const sagas = createDynamicResourceSagas(actions, types, api, onSuccess)
    const data = { name: 'John' }
    const type = types[operation.toUpperCase() as keyof ResourceTypes]
    const id = 'id001'
    const saga = sagas[type]({ type, id, data })
    expect(saga.next().value).toEqual(put(setPending(id)))
    expect(saga.next().value).toEqual(call(api[operation], id, data))
    const error = new Error('error')
    expect(saga.throw!(error).value).toEqual(put(setError(id, error)))
    expect(saga.next().done).toBeTruthy()
    expect(onSuccess[operation]).not.toHaveBeenCalled()
  }

  it('should warn when using an operation that wasn\'t defined by the api', () => {
    const myApi = { load: api.load }
    const { actions, types } = createDynamicResourceActions('DEFAULT')
    const sagas = createDynamicResourceSagas(actions, types, myApi, onSuccess)
    sagas['DEFAULT/CREATE']({ type: 'DEFAULT/CREATE' })
    expect(sagaUtils.createMissingSagaWarning).toHaveBeenCalledWith({ type: 'DEFAULT/CREATE' })
  })

  it('should successfully load', () => {
    const { actions, types } = createDynamicResourceActions('DEFAULT')
    const { setLoadPending, setLoadSuccess } = actions
    const sagas = createDynamicResourceSagas(actions, types, api, onSuccess)
    const params = { name: 'John' }
    const id = 'id001'
    const saga = sagas[types.LOAD]({ type: types.LOAD, id, params })
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setLoadPending(id)))
    expect(saga.next().value).toEqual(call(api.load, id, params))
    expect(saga.next(response).value).toEqual(put(setLoadSuccess(id, response)))
    saga.next()
    expect(onSuccess.load).toHaveBeenCalledWith({ id, requestData: params, responseData: response })
    expect(saga.next().done).toBeTruthy()
  })

  it('should yield error while loading', () => {
    const { actions, types } = createDynamicResourceActions('DEFAULT')
    const { setLoadPending, setLoadError } = actions
    const sagas = createDynamicResourceSagas(actions, types, api, onSuccess)
    const params = { name: 'John' }
    const id = 'id001'
    const saga = sagas[types.LOAD]({ type: types.LOAD, id, params })
    expect(saga.next().value).toEqual(put(setLoadPending(id)))
    expect(saga.next().value).toEqual(call(api.load, id, params))
    const error = new Error('error')
    expect(saga.throw!(error).value).toEqual(put(setLoadError(id, error)))
    expect(saga.next().done).toBeTruthy()
    expect(onSuccess.load).not.toHaveBeenCalled()
  })

  it('should successfully create', () => {
    testModifySuccess('create', 'setCreatePending', 'setCreateSuccess')
  })

  it('should yield error while creating', () => {
    testModifyError('create', 'setCreatePending', 'setCreateError')
  })

  it('should successfully update', () => {
    testModifySuccess('update', 'setUpdatePending', 'setUpdateSuccess')
  })

  it('should yield error while updating', () => {
    testModifyError('update', 'setUpdatePending', 'setUpdateError')
  })

  it('should successfully remove', () => {
    testModifySuccess('remove', 'setRemovePending', 'setRemoveSuccess')
  })

  it('should yield error while removing', () => {
    testModifyError('remove', 'setRemovePending', 'setRemoveError')
  })
})
