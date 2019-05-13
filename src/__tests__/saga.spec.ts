import createResourceActions from '../actions/static'
import { loadResource, modifyResource } from '../sagas/static'
import { call, put } from 'redux-saga/effects'

describe('Saga', () => {
  it('should successfully load', () => {
    const { actions } = createResourceActions('DEFAULT')
    const { setLoadProgress, setLoadSuccess } = actions
    const odin = { load: jest.fn() }
    const load = loadResource(actions, odin.load)
    const sagaParams = { type: 'type', params: 'JONH' }
    const saga = load(sagaParams)
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setLoadProgress()))
    expect(saga.next().value).toEqual(call(odin.load, sagaParams.params))
    expect(saga.next(response).value).toEqual(put(setLoadSuccess(response)))
    expect(saga.next().done).toBeTruthy()
  })

  it('should yield error while loading', () => {
    const { actions } = createResourceActions('DEFAULT')
    const { setLoadProgress, setLoadError } = actions
    const odin = { load: jest.fn() }
    const load = loadResource(actions, odin.load)
    const sagaParams = { type: 'type', params: 'JONH' }
    const saga = load(sagaParams)
    expect(saga.next().value).toEqual(put(setLoadProgress()))
    expect(saga.next().value).toEqual(call(odin.load, sagaParams.params))
    const error = new Error('error')
    expect(saga.throw!(error).value).toEqual(put(setLoadError(error)))
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
    const saga = update({ data, type: 'type' })
    const response = 'ok'
    expect(saga.next().value).toEqual(put(setUpdateProgress()))
    expect(saga.next().value).toEqual(call(execute, data))
    expect(saga.next(response).value).toEqual(put(setUpdateSuccess()))
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
    const saga = update({ data, type: 'type' })
    expect(saga.next().value).toEqual(put(setUpdateProgress()))
    expect(saga.next().value).toEqual(call(execute, data))
    const error = new Error('error')
    expect(saga.throw!(error).value).toEqual(put(setUpdateError(error)))
    expect(saga.next().done).toBeTruthy()
  })
})
