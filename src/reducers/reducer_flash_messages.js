import { SET_FLASH_MESSAGE } from '../actions/actions_flash_messages'

const INITIAL_STATE = { type: '', message: '' }

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SET_FLASH_MESSAGE:
     return {...state, ...action.payload}
  default:
    return state
  }
}
