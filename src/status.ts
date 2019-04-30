interface StatusMap {
  [key: string]: Status,
}

export const Status: StatusMap = {
  pristine: 'pristine',
  pending: 'pending',
  success: 'success',
  error: 'error',
}

export const isLoadPristine = (resource: Resource<any>) => resource.load.status === Status.pristine
export const isPristine = isLoadPristine // alias for isLoadPristine
export const isLoading = (resource: Resource<any>) => resource.load.status === Status.pending
export const hasLoadSuccess = (resource: Resource<any>) => resource.load.status === Status.success
export const hasLoadError = (resource: Resource<any>) => resource.load.status === Status.error

export const isCreatePristine = (resource: Resource<any>) => resource.create.status === Status.pristine
export const isCreating = (resource: Resource<any>) => resource.create.status === Status.pending
export const hasCreateSuccess = (resource: Resource<any>) => resource.create.status === Status.success
export const hasCreateError = (resource: Resource<any>) => resource.create.status === Status.error

export const isUpdatePristine = (resource: Resource<any>) => resource.update.status === Status.pristine
export const isUpdating = (resource: Resource<any>) => resource.update.status === Status.pending
export const hasUpdateSuccess = (resource: Resource<any>) => resource.update.status === Status.success
export const hasUpdateError = (resource: Resource<any>) => resource.update.status === Status.error

export const isRemovePristine = (resource: Resource<any>) => resource.remove.status === Status.pristine
export const isRemoving = (resource: Resource<any>) => resource.remove.status === Status.pending
export const hasRemoveSuccess = (resource: Resource<any>) => resource.remove.status === Status.success
export const hasRemoveError = (resource: Resource<any>) => resource.remove.status === Status.error
