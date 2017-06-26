import { FETCH_PROVIDER } from '../actions/actions_provider'

const INITIAL_STATE = {}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_PROVIDER:
    return {...state, eth: action.payload.Eth}
  default:
    return state
  }
}
