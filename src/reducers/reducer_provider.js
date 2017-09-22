import { FETCH_PROVIDER } from '../actions/actions_provider'

const INITIAL_STATE = {eth: {}, isConnected: false}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_PROVIDER:
    return {...state, eth: action.payload.eth, isConnected: action.payload.isConnected}
  default:
    return state
  }
}
