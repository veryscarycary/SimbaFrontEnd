import Eth from 'ethjs'
import axios from 'axios'

import { headers, SIGN_UP_URL, SIGN_IN_URL, USERS_URL } from '../api_url'
import { setFlashMessage } from './actions_flash_messages'

import Auth from '../services/auth'

export const CREATE_USERS = 'CREATE_USERS'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const SELECT_USER = 'SELECT_USER'
export const CREATE_USER = 'CREATE_USER'
export const UPDATE_USER = 'UPDATE_USER'

export function fetchBalance(provider, wallet) {
  return dispatch => {
    provider.eth.getBalance(wallet, 'latest').then(result => {
      const balance = Eth.fromWei(result, 'ether').toString()
      dispatch({type: UPDATE_USER, payload: { wallet: wallet, balance: balance}});
    })
  }
}

export function setCurrentUser(provider, wallet, authentication_token) {
  return dispatch => {
    dispatch({ type: CREATE_USER, payload: { wallet, authentication_token }})
    dispatch({ type: SET_CURRENT_USER, payload: wallet })
    if (wallet !== '') {
      dispatch(fetchBalance(provider, wallet))
    }
  }
}

export function deleteCurrentUser(provider, wallet) {
  Auth.deleteAll()

  return setCurrentUser(provider, '', '')
}

export function selectUser(wallet) {
  return dispatch => {
    dispatch({ type: SELECT_USER, payload: wallet })
    dispatch({ type: CREATE_USER, payload: { wallet } })
  }
}

export function fetchAllUsers() {
  const request = axios.get(USERS_URL, headers)
  return {
    type: CREATE_USERS,
    payload: request
  }
}

export function userRegistration(user_params) {
  return dispatch => {
    return axios.post(SIGN_UP_URL, user_params)
       .then((response) => {
        Auth.setWallet(response.data['wallet'])
        Auth.setToken(response.data['authentication_token'])

        dispatch({ type: SET_CURRENT_USER, payload: response.data.wallet })
        dispatch({ type: CREATE_USER, payload: response.data })
        dispatch(setFlashMessage("User has been successfully created.", 'success'))
     }).catch((error) => {
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
    return axios.post(SIGN_IN_URL, user_params)
           .then((response) => {
            Auth.setWallet(response.data['wallet'])
            Auth.setToken(response.data['authentication_token'])

            dispatch({ type: SET_CURRENT_USER, payload: response.data.wallet })
            dispatch({ type: CREATE_USER, payload: response.data })
            dispatch(setFlashMessage("User has been successfully signed in.", 'success'))
         }).catch((error) => {
            console.log(error)

            Auth.deleteAll()

            if (error.response) {
              dispatch(setFlashMessage(error.response.data.error, 'error'))
            } else {
              dispatch(setFlashMessage("Error while signing you in, please try again later.", 'error'))
            }
         })
  }
}
