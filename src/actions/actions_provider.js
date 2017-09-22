import getProvider from '../utils/getProvider'
import Auth from '../services/auth'

import { setCurrentUser, fetchBalance } from './actions_users'

export const FETCH_PROVIDER = 'FETCH_PROVIDER'


export function fetchProvider() {
  return dispatch => {
    return getProvider.then(provider => {
      provider.Eth.accounts().then((accounts) => {
        if (typeof accounts[0] === 'undefined') {
          dispatch(setCurrentUser('', Auth.token))
          dispatch({type: FETCH_PROVIDER, payload: {eth: provider.Eth, isConnected: false}})
        } else {
          dispatch(setCurrentUser(accounts[0], Auth.token))
          dispatch({type: FETCH_PROVIDER, payload: {eth: provider.Eth, isConnected: true}})
          dispatch(fetchBalance(provider, accounts[0]))
        }
      })
    }).catch((err) => {
      console.log('Error finding Provider : ', err)
    })
  }
}
