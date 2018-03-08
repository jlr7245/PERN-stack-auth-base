import { createStore, compose, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

export const history = createHistory()

const initialState = {
  auth: {
    user: null,
    isAuth: false
  }
}

const enhancers = []
const middlewares = [
  thunk,
  routerMiddleware(history)
]

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
)

export default createStore(
  rootReducer,
  initialState,
  composedEnhancers
)
