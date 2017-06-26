import { FETCH_BALANCE } from '../actions/actions_users'

const INITIAL_STATE = {
    1: {id: 1, name: 'Bob', wallet: '0x0Aa7fa099de11980486A11Bcf2865f48f6a90128', balance: '0'},
    2: {id: 2, name: 'Mary', wallet: '0x08b41D8A406F941126fc1D15eCe163fbFA113d54', balance: '0'}
  }
export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_BALANCE:
    return {
      ...state, [action.payload.id]: action.payload
    }
  default:
    return state
  }
}
