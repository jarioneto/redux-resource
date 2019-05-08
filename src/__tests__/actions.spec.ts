// import { createResourceActions } from '../actions'
// import { capitalize, reduce } from 'lodash'

// const testActionCreators = (actionCreators, namespace, type) => {
//   const capitalizedType = capitalize(type)
//   const upperName = namespace.toUpperCase()
//   const upperType = type.toUpperCase()

//   // basic action
//   let actionObject = actionCreators[type]({ test: 'test' })
//   const key = type === 'load' ? 'params' : 'data'
//   let expected = { type: `${upperName}/${upperType}`, [key]: { test: 'test' } }
//   expect(actionObject).toEqual(expected)

//   // progress
//   actionObject = actionCreators[`set${capitalizedType}Progress`]()
//   expected = { type: `${upperName}/${upperType}_PROGRESS` }
//   expect(actionObject).toEqual(expected)

//   // success
//   actionObject = actionCreators[`set${capitalizedType}Success`]()
//   expected = { type: `${upperName}/${upperType}_SUCCESS` }
//   expect(actionObject).toEqual(expected)

//   // error
//   actionObject = actionCreators[`set${capitalizedType}Error`]()
//   expected = { type: `${upperName}/${upperType}_ERROR` }
//   expect(actionObject).toEqual(expected)

//   // reset
//   actionObject = actionCreators[`reset${capitalizedType}Status`]()
//   expected = { type: `${upperName}/RESET_${upperType}_STATUS` }
//   expect(actionObject).toEqual(expected)
// }

// const getTypes = (namespace, type) => {
//   const keys = [
//     `${type}`,
//     `${type}_PROGRESS`,
//     `${type}_SUCCESS`,
//     `${type}_ERROR`,
//     `RESET_${type}_STATUS`,
//   ]

//   return reduce(keys, (result, key) => ({ ...result, [key]: `${namespace}/${key}` }), {})
// }

// describe('Create Resource Actions', () => {
//   it('should return default actions', () => {
//     const { actions } = createResourceActions('DEFAULT')
//     testActionCreators(actions, 'DEFAULT', 'load')
//     testActionCreators(actions, 'DEFAULT', 'create')
//     testActionCreators(actions, 'DEFAULT', 'update')
//     testActionCreators(actions, 'DEFAULT', 'remove')
//   })

//   it('should return default types', () => {
//     const { types } = createResourceActions('DEFAULT')
//     const expectedTypes = {
//       ...getTypes('DEFAULT', 'LOAD'),
//       ...getTypes('DEFAULT', 'CREATE'),
//       ...getTypes('DEFAULT', 'UPDATE'),
//       ...getTypes('DEFAULT', 'REMOVE'),
//     }
//     expect(types).toEqual(expectedTypes)
//   })

//   it('should return actions and types with additional', () => {
//     const additionalType = { CUSTOM: 'CUSTOM' }
//     const additionalAction = { custom: () => ({ type: 'CUSTOM' }) }
//     const { types, actions } = createResourceActions('DEFAULT', additionalType, additionalAction)
//     expect(actions.custom()).toEqual({ type: 'CUSTOM' })
//     expect(types.CUSTOM).toBe('CUSTOM')
//   })
// })
