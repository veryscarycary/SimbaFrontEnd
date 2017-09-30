import { FETCH_PROVIDER, FETCH_PROVIDER_SUCCEEDED } from '../actions/actions_provider'

const INITIAL_STATE = {eth: {}, isConnected: false}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_PROVIDER:
    return {
      ...state,
      fetching: true,
    }
  case FETCH_PROVIDER_SUCCEEDED:
    return {...state, eth: action.payload.eth, isConnected: action.payload.isConnected, fetching: false}
  default:
    return state
  }
}
