import { combineReducers } from 'redux'
import providerReducer from './reducer_provider'
import usersReducer from './reducer_users'

const rootReducer = combineReducers({
  provider: providerReducer,
  users: usersReducer
})

export default rootReducer
