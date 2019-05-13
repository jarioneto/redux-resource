import { Resource } from './types'

interface StatusMap {
  pristine: 'pristine',
  pending: 'pending',
  success: 'success',
  error: 'error',
}

export const status: StatusMap = {
  pristine: 'pristine',
  pending: 'pending',
  success: 'success',
  error: 'error',
}

export const isLoadPristine = (resource?: Resource<any>) =>
  !resource || resource.load.status === status.pristine
export const isPristine = isLoadPristine // alias for isLoadPristine
export const isLoading = (resource?: Resource<any>) =>
  resource && resource.load.status === status.pending
export const hasLoadSuccess = (resource?: Resource<any>) =>
  resource && resource.load.status === status.success
export const hasLoadError = (resource?: Resource<any>) =>
  resource && resource.load.status === status.error

export const isCreatePristine = (resource?: Resource<any>) =>
  !resource || resource.create.status === status.pristine
export const isCreating = (resource?: Resource<any>) =>
  resource && resource.create.status === status.pending
export const hasCreateSuccess = (resource?: Resource<any>) =>
  resource && resource.create.status === status.success
export const hasCreateError = (resource?: Resource<any>) =>
  resource && resource.create.status === status.error

export const isUpdatePristine = (resource?: Resource<any>) =>
  !resource || resource.update.status === status.pristine
export const isUpdating = (resource?: Resource<any>) =>
  resource && resource.update.status === status.pending
export const hasUpdateSuccess = (resource?: Resource<any>) =>
  resource && resource.update.status === status.success
export const hasUpdateError = (resource?: Resource<any>) =>
  resource && resource.update.status === status.error

export const isRemovePristine = (resource?: Resource<any>) =>
  !resource || resource.remove.status === status.pristine
export const isRemoving = (resource?: Resource<any>) =>
  resource && resource.remove.status === status.pending
export const hasRemoveSuccess = (resource?: Resource<any>) =>
  resource && resource.remove.status === status.success
export const hasRemoveError = (resource?: Resource<any>) =>
  resource && resource.remove.status === status.error
