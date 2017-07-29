import { SELECT_ITEM } from '../actions/actions_items'

export default function(state = 0, action) {
  switch(action.type) {
  case SELECT_ITEM:
    return action.payload
  default:
    return state
  }
}
