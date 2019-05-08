import { Resource, Status } from './types'

export const isLoadPristine = (resource: Resource<any>) => resource.load.status === Status.Pristine
export const isPristine = isLoadPristine // alias for isLoadPristine
export const isLoading = (resource: Resource<any>) => resource.load.status === Status.Pending
export const hasLoadSuccess = (resource: Resource<any>) => resource.load.status === Status.Success
export const hasLoadError = (resource: Resource<any>) => resource.load.status === Status.Error

export const isCreatePristine = (resource: Resource<any>) => resource.create.status === Status.Pristine
export const isCreating = (resource: Resource<any>) => resource.create.status === Status.Pending
export const hasCreateSuccess = (resource: Resource<any>) => resource.create.status === Status.Success
export const hasCreateError = (resource: Resource<any>) => resource.create.status === Status.Error

export const isUpdatePristine = (resource: Resource<any>) => resource.update.status === Status.Pristine
export const isUpdating = (resource: Resource<any>) => resource.update.status === Status.Pending
export const hasUpdateSuccess = (resource: Resource<any>) => resource.update.status === Status.Success
export const hasUpdateError = (resource: Resource<any>) => resource.update.status === Status.Error

export const isRemovePristine = (resource: Resource<any>) => resource.remove.status === Status.Pristine
export const isRemoving = (resource: Resource<any>) => resource.remove.status === Status.Pending
export const hasRemoveSuccess = (resource: Resource<any>) => resource.remove.status === Status.Success
export const hasRemoveError = (resource: Resource<any>) => resource.remove.status === Status.Error
