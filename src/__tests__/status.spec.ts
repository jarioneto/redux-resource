import {
  isLoadPristine,
  isPristine,
  isLoading,
  hasLoadSuccess,
  hasLoadError,

  isCreatePristine,
  isCreating,
  hasCreateSuccess,
  hasCreateError,

  isUpdatePristine,
  isUpdating,
  hasUpdateSuccess,
  hasUpdateError,

  isRemovePristine,
  isRemoving,
  hasRemoveSuccess,
  hasRemoveError,
} from '../status'

import { Status, Resource, Operation } from '../types'

import { createResourceInitialState } from '../reducers/utils'

const resourceWithState = (operation: Operation, status: Status) => ({
  ...createResourceInitialState(),
  [operation]: { status, error: null },
})

const test = (fn: (resource?: Resource<any>) => boolean, operation: Operation, status: Status) => {
  expect(fn()).toBe(status === Status.pristine)
  expect(fn(createResourceInitialState())).toBe(status === Status.pristine)
  expect(fn(resourceWithState(operation, Status.pending))).toBe(status === Status.pending)
  expect(fn(resourceWithState(operation, Status.success))).toBe(status === Status.success)
  expect(fn(resourceWithState(operation, Status.error))).toBe(status === Status.error)
}

describe('Status helpers', () => {
  it('isLoadPristine should work', () => {
    test(isLoadPristine, 'load', Status.pristine)
    expect(isPristine).toBe(isLoadPristine)
  })
  it('isLoading should work', () => test(isLoading, 'load', Status.pending))
  it('hasLoadSuccess should work', () => test(hasLoadSuccess, 'load', Status.success))
  it('hasLoadError should work', () => test(hasLoadError, 'load', Status.error))

  it('isCreatePristine should work', () => test(isCreatePristine, 'create', Status.pristine))
  it('isCreating should work', () => test(isCreating, 'create', Status.pending))
  it('hasCreateSuccess should work', () => test(hasCreateSuccess, 'create', Status.success))
  it('hasCreateError should work', () => test(hasCreateError, 'create', Status.error))

  it('isUpdatePristine should work', () => test(isUpdatePristine, 'update', Status.pristine))
  it('isUpdating should work', () => test(isUpdating, 'update', Status.pending))
  it('hasUpdateSuccess should work', () => test(hasUpdateSuccess, 'update', Status.success))
  it('hasUpdateError should work', () => test(hasUpdateError, 'update', Status.error))

  it('isRemovePristine should work', () => test(isRemovePristine, 'remove', Status.pristine))
  it('isRemoving should work', () => test(isRemoving, 'remove', Status.pending))
  it('hasRemoveSuccess should work', () => test(hasRemoveSuccess, 'remove', Status.success))
  it('hasRemoveError should work', () => test(hasRemoveError, 'remove', Status.error))
})
