import Auth from '../services/auth'
import { setCurrentUser, fetchBalance } from './actions_users'
import EscrowContract from '../services/escrow'

export const FETCH_PROVIDER = 'FETCH_PROVIDER'
export const FETCH_PROVIDER_SUCCEEDED = 'FETCH_PROVIDER_SUCCEEDED'

export function fetchProvider() {
  return dispatch => {
    dispatch({ type: FETCH_PROVIDER })

    return EscrowContract.provider().then((provider) => {
      return EscrowContract.accounts()
        .then((accounts) => {
          if (typeof accounts[0] === 'undefined') {
            Auth.setWallet('')
            dispatch({type: FETCH_PROVIDER_SUCCEEDED, payload: {eth: provider.Eth, isConnected: false}})
          } else {
            dispatch(setCurrentUser({wallet: accounts[0], authentication_token: Auth.token}))
            dispatch({type: FETCH_PROVIDER_SUCCEEDED, payload: {eth: provider.Eth, isConnected: true}})
            dispatch(fetchBalance(accounts[0]))
          }
        }).catch((err) => {
          console.log('Error finding Provider : ', err)
        })
    })
  }
}
