import Eth from 'ethjs'

import Api, { SIGN_UP_URL, SIGN_IN_URL, USERS_URL, MY_PROFILE_URL } from '../services/api'
import { setFlashMessage } from './actions_flash_messages'

import Auth from '../services/auth'

export const CREATE_USERS = 'CREATE_USERS'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const SELECT_USER = 'SELECT_USER'
export const CREATE_USER = 'CREATE_USER'
export const UPDATE_USER = 'UPDATE_USER'

export function fetchBalance(provider, wallet) {
  return dispatch => {
    provider.Eth.getBalance(wallet, 'latest').then(result => {
      const balance = Eth.fromWei(result, 'ether').toString()
      dispatch({type: UPDATE_USER, payload: { wallet: wallet, balance: balance}});
    })
  }
}

export function setCurrentUser(user) {
  return dispatch => {
    Auth.setWallet(user['wallet'])
    Auth.setToken(user['authentication_token'])
    dispatch({ type: CREATE_USER, payload: user})
    dispatch({ type: SET_CURRENT_USER, payload: user['wallet'] })
  }
}

export function deleteCurrentUser(wallet) {
  Auth.deleteAll()

  return dispatch => {
    dispatch({ type: SET_CURRENT_USER, payload: '' })
  }
}

export function selectUser(wallet) {
  return dispatch => {
    dispatch({ type: SELECT_USER, payload: wallet })
    dispatch({ type: CREATE_USER, payload: { wallet } })
  }
}

export function fetchAllUsers() {
  const request = Api.get(USERS_URL)
  return {
    type: CREATE_USERS,
    payload: request
  }
}

export function userRegistration(user_params) {
  return dispatch => {
    return Api.post(SIGN_UP_URL, user_params)
       .then((response) => {
        setCurrentUser(response.data)
     }).catch((error) => {
        Auth.deleteAll()
        if (error.response) {
          const error_field = Object.keys(error.response.data.errors)[0]
          const error_message = error.response.data.errors[error_field]
          dispatch(setFlashMessage(`${error_field} ${error_message}`, 'error'))
        } else {
          dispatch(setFlashMessage("Error while creating your account, please try again later.", 'error'))
        }
     })
  }
}

export function userSignIn(user_params) {
  return dispatch => {
    return Api.post(SIGN_IN_URL, user_params)
           .then((response) => {
            dispatch(setCurrentUser(response.data))
         }).catch((error) => {
            Auth.deleteAll()
            if (error.response) {
              dispatch(setFlashMessage(error.response.data.error, 'error'))
            } else {
              dispatch(setFlashMessage("Error while signing you in, please try again later.", 'error'))
            }
         })
  }
}

export function getUserProfile(wallet, isCurrentUser) {
  var apiProfileUrl = isCurrentUser ? MY_PROFILE_URL : `${USERS_URL}/${wallet}`
  return dispatch => {
    return Api.get(apiProfileUrl, { headers: { 'X-User-Wallet': Auth.wallet, 'X-User-Token': Auth.token } })
                .then((response) => {
                  dispatch(setCurrentUser(response.data))
              }).catch((error) => {
                Auth.deleteAll()
                if (error.response) {
                  dispatch(setFlashMessage(error.response.data.error, 'error'))
                } else {
                  dispatch(setFlashMessage("Error, please try again later.", 'error'))
                }
              })
  }
}
