import { SET_CURRENT_USER, SELECT_USER } from '../actions/actions_users'

export function currentUserWalletReducer(state = '', action) {
  switch(action.type) {
  case SET_CURRENT_USER:
    return action.payload
  default:
    return state
  }
}


export function selectedUserWalletReducer(state = '', action) {
  switch(action.type) {
  case SELECT_USER:
    return action.payload
  default:
    return state
  }
}
