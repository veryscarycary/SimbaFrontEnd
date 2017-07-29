import { SELECT_PURCHASE } from '../actions/actions_purchases'

export default function(state = 0, action) {
  switch(action.type) {
    case SELECT_PURCHASE:
      return action.payload
    default:
      return state
  }
}
