// import { FETCH_PRODUCT } from '../actions/actions_products'

const INITIAL_STATE = {message: ''}

export default function(state = INITIAL_STATE, action) {
  // console.log('reducer action', action)
  switch(action.type) {
  // case FETCH_PRODUCT:
  //   return {...state, message: action.payload.data.message}
  default:
    return state
  }
}
