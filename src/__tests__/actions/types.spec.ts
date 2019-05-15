import createResourceActions from '../../actions/static'
import { reduce } from 'lodash'

const getTypes = (namespace: string, type: string) => {
  const keys = [
    `${type}`,
    `${type}_PROGRESS`,
    `${type}_SUCCESS`,
    `${type}_ERROR`,
    `RESET_${type}_STATUS`,
  ]

  return reduce(keys, (result, key) => ({ ...result, [key]: `${namespace}/${key}` }), {})
}

describe('Action types', () => {
  it('should return action types', () => {
    const { types } = createResourceActions('DEFAULT')
    const expectedTypes = {
      ...getTypes('DEFAULT', 'LOAD'),
      ...getTypes('DEFAULT', 'CREATE'),
      ...getTypes('DEFAULT', 'UPDATE'),
      ...getTypes('DEFAULT', 'REMOVE'),
    }
    expect(types).toEqual(expectedTypes)
  })
})
