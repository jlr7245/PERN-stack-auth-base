import * as TYPES from '../constants/ActionTypes'

export const setUser = (user, isAuth) => ({
  type: TYPES.SET_USER,
  user,
  isAuth
})

export const clearUser = () => ({
  type: TYPES.CLEAR_USER
})

export const verifyUser = () => dispatch => {
  fetch('/api/user/verify', { credentials: 'include' })
    .then(res => res.json())
    .then(({ user, isAuth }) => dispatch(setUser(user, isAuth)))
    .catch(err => console.log(err))
}

export const loginUser = ({ username, password }) => dispatch => {
  fetch('/api/user/login', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(({ user, isAuth }) => dispatch(setUser(user, isAuth)))
  .catch(err => console.log(err))
}

export const registerUser = user => dispatch => {
  fetch('/api/user/register', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user })
  })
  .then(res => res.json())
  .then(({ user, isAuth }) => dispatch(setUser(user, isAuth)))
  .catch(err => console.log(err))
}
