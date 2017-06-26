import Eth from 'ethjs'
export const FETCH_BALANCE = 'FETCH_BALANCE';

export function fetchBalance(provider, user) {
  if (provider.eth) {
    return dispatch => {
      provider.eth.getBalance(user.wallet, 'latest').then(result => {
        const balance = Eth.fromWei(result, 'ether').toString()
        user.balance = balance
        dispatch({type: FETCH_BALANCE, payload: user});
      })
    }
  }
}
