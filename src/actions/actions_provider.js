import getProvider from '../utils/getProvider'

export const FETCH_PROVIDER = 'FETCH_PROVIDER';

export function fetchProvider() {
  return dispatch => {
    getProvider.then(request => {
      dispatch({type: FETCH_PROVIDER, payload: request});
    }).catch((err) => {
      console.log('Error finding Provider : ', err)
    })
  }

}
