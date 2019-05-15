import * as sagaUtils from '../../sagas/utils'
import { set } from 'lodash'

// mocking sagaUtils
const originalWarning = sagaUtils.createMissingSagaWarning
set(sagaUtils, 'createMissingSagaWarning', jest.fn())
const unmock = () => set(sagaUtils, 'createMissingSagaWarning', originalWarning)
// end mock

import createResourceActions from '../../actions/static'
import createResourceSagas from '../../sagas/static'
import { call, put } from 'redux-saga/effects'
import {
  FunctionMap,
  ResourceTypes,
  Operation,
  SuccessAction,
  ProgressAction,
  ErrorAction,
} from '../../types'

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
    setProgressKey: ProgressAction,
    setSuccessKey: SuccessAction,
  ) => {
    const { actions, types } = createResourceActions('DEFAULT')
    const setProgress = actions[setProgressKey]
    const setSuccess = actions[setSuccessKey]
    const sagas = createResourceSagas(actions, types, api, onSuccess)
    const data = { name: 'John' }
    const type = types[operation.toUpperCase() as keyof ResourceTypes]
    const saga = sagas[type]({ type, data })
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setProgress()))
    expect(saga.next().value).toEqual(call(api[operation], data))
    expect(saga.next(response).value).toEqual(put(setSuccess()))
    saga.next()
    expect(onSuccess[operation]).toHaveBeenCalledWith({ requestData: data, responseData: response })
    expect(saga.next().done).toBeTruthy()
  }

  const testModifyError = (
    operation: Operation,
    setProgressKey: ProgressAction,
    setErrorKey: ErrorAction,
  ) => {
    const { actions, types } = createResourceActions('DEFAULT')
    const setProgress = actions[setProgressKey]
    const setError = actions[setErrorKey]
    const sagas = createResourceSagas(actions, types, api, onSuccess)
    const data = { name: 'John' }
    const type = types[operation.toUpperCase() as keyof ResourceTypes]
    const saga = sagas[type]({ type, data })
    expect(saga.next().value).toEqual(put(setProgress()))
    expect(saga.next().value).toEqual(call(api[operation], data))
    const error = new Error('error')
    expect(saga.throw!(error).value).toEqual(put(setError(error)))
    expect(saga.next().done).toBeTruthy()
    expect(onSuccess[operation]).not.toHaveBeenCalled()
  }

  it('should warn when using an operation that wasn\'t defined by the api', () => {
    const myApi = { load: api.load }
    const { actions, types } = createResourceActions('DEFAULT')
    const sagas = createResourceSagas(actions, types, myApi, onSuccess)
    sagas['DEFAULT/CREATE']({ type: 'DEFAULT/CREATE' })
    expect(sagaUtils.createMissingSagaWarning).toHaveBeenCalledWith({ type: 'DEFAULT/CREATE' })
  })

  it('should successfully load', () => {
    const { actions, types } = createResourceActions('DEFAULT')
    const { setLoadProgress, setLoadSuccess } = actions
    const sagas = createResourceSagas(actions, types, api, onSuccess)
    const params = { name: 'John' }
    const saga = sagas[types.LOAD]({ type: types.LOAD, params })
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setLoadProgress()))
    expect(saga.next().value).toEqual(call(api.load, params))
    expect(saga.next(response).value).toEqual(put(setLoadSuccess(response)))
    saga.next()
    expect(onSuccess.load).toHaveBeenCalledWith({ requestData: params, responseData: response })
    expect(saga.next().done).toBeTruthy()
  })

  it('should yield error while loading', () => {
    const { actions, types } = createResourceActions('DEFAULT')
    const { setLoadProgress, setLoadError } = actions
    const sagas = createResourceSagas(actions, types, api, onSuccess)
    const params = { name: 'John' }
    const saga = sagas[types.LOAD]({ type: types.LOAD, params })
    expect(saga.next().value).toEqual(put(setLoadProgress()))
    expect(saga.next().value).toEqual(call(api.load, params))
    const error = new Error('error')
    expect(saga.throw!(error).value).toEqual(put(setLoadError(error)))
    expect(saga.next().done).toBeTruthy()
    expect(onSuccess.load).not.toHaveBeenCalled()
  })

  it('should successfully create', () => {
    testModifySuccess('create', 'setCreateProgress', 'setCreateSuccess')
  })

  it('should yield error while creating', () => {
    testModifyError('create', 'setCreateProgress', 'setCreateError')
  })

  it('should successfully update', () => {
    testModifySuccess('update', 'setUpdateProgress', 'setUpdateSuccess')
  })

  it('should yield error while updating', () => {
    testModifyError('update', 'setUpdateProgress', 'setUpdateError')
  })

  it('should successfully remove', () => {
    testModifySuccess('remove', 'setRemoveProgress', 'setRemoveSuccess')
  })

  it('should yield error while removing', () => {
    testModifyError('remove', 'setRemoveProgress', 'setRemoveError')
  })

})
