import * as TYPES from '../constants/ActionTypes'

export const auth = (state = {}, action) => {
  const { type, user, isAuth } = action
  switch(type) {
    case TYPES.SET_USER:
      return {
        user,
        isAuth
      }
    case TYPES.CLEAR_USER:
      return {
        user: null,
        isAuth: false
      }
    default:
      return state
  }
}
