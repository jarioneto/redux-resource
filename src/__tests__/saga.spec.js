import { createResourceActions } from '../actions'
import { loadResource, modifyResource } from '../sagas'
import { call, put } from 'redux-saga/effects'

describe('Saga', () => {
  it('should successfully load', () => {
    const { actions } = createResourceActions('DEFAULT')
    const { setLoadProgress, setLoadSuccess } = actions
    const odin = { load: jest.fn() }
    const load = loadResource(actions, odin.load)
    const params = { name: 'JONH' }
    const saga = load({ params })
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setLoadProgress()))
    expect(saga.next().value).toEqual(call(odin.load, params))
    expect(saga.next(response).value).toEqual(put(setLoadSuccess(response)))
    expect(saga.next().done).toBeTruthy()
  })

  it('should yield error while loading', () => {
    const { actions } = createResourceActions('DEFAULT')
    const { setLoadProgress, setLoadError } = actions
    const odin = { load: jest.fn() }
    const load = loadResource(actions, odin.load)
    const params = { name: 'JONH' }
    const saga = load({ params })
    expect(saga.next().value).toEqual(put(setLoadProgress()))
    expect(saga.next().value).toEqual(call(odin.load, params))
    expect(saga.throw().value).toEqual(put(setLoadError()))
    expect(saga.next().done).toBeTruthy()
  })

  it('should successfully modify resource', () => {
    const { actions } = createResourceActions('DEFAULT')
    const { setUpdateProgress, setUpdateSuccess, setUpdateError } = actions
    const execute = jest.fn()
    const update = modifyResource({
      setProgress: setUpdateProgress,
      setSuccess: setUpdateSuccess,
      setError: setUpdateError,
      execute,
    })
    const data = { name: 'JONH' }
    const saga = update({ data })
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setUpdateProgress()))
    expect(saga.next().value).toEqual(call(execute, data))
    expect(saga.next(response).value).toEqual(put(setUpdateSuccess(response)))
    expect(saga.next().done).toBeTruthy()
  })

  it('should yield error while modifying resource', () => {
    const { actions } = createResourceActions('DEFAULT')
    const { setUpdateProgress, setUpdateSuccess, setUpdateError } = actions
    const execute = jest.fn()
    const update = modifyResource({
      setProgress: setUpdateProgress,
      setSuccess: setUpdateSuccess,
      setError: setUpdateError,
      execute,
    })
    const data = { name: 'JONH' }
    const saga = update({ data })
    expect(saga.next().value).toEqual(put(setUpdateProgress()))
    expect(saga.next().value).toEqual(call(execute, data))
    expect(saga.throw().value).toEqual(put(setUpdateError()))
    expect(saga.next().done).toBeTruthy()
  })
})
