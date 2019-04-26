export const isLoading = (resource: Resource<any>) => resource.loadStatus === Status.pending
export const hasLoadSuccess = (resource: Resource<any>) => resource.loadStatus === Status.success
export const hasLoadError = (resource: Resource<any>) => resource.loadStatus === Status.error

export const isCreating = (resource: Resource<any>) => resource.createStatus === Status.pending
export const hasCreateSuccess = (resource: Resource<any>) => resource.createStatus === Status.success
export const hasCreateError = (resource: Resource<any>) => resource.createStatus === Status.error

export const isUpdating = (resource: Resource<any>) => resource.updateStatus === Status.pending
export const hasUpdateSuccess = (resource: Resource<any>) => resource.updateStatus === Status.success
export const hasUpdateError = (resource: Resource<any>) => resource.updateStatus === Status.error

export const isRemoving = (resource: Resource<any>) => resource.removeStatus === Status.pending
export const hasRemoveSuccess = (resource: Resource<any>) => resource.removeStatus === Status.success
export const hasRemoveError = (resource: Resource<any>) => resource.removeStatus === Status.error
