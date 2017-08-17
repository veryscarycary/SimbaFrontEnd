import axios from 'axios'
import { normalize } from 'normalizr'

import { itemsNormalizr, itemNormalizr } from '../models/normalizr'
import { headers, ITEMS_URL, SELLER_ITEMS_URL } from '../api_url'
import { setFlashMessage } from './actions_flash_messages'
import { fetchItemSalesNumber, fetchItemRating, fetchUserRating } from './actions_contract'

import { CREATE_USERS } from './actions_users'

export const SELECT_ITEM = 'SELECT_ITEM'
export const CREATE_ITEM = 'CREATE_ITEM'
export const CREATE_ITEMS = 'CREATE_ITEMS'
export const UPDATE_ITEM = 'UPDATE_ITEM'

export function fetchAllItems(provider) {
  return dispatch => {
    axios.get(ITEMS_URL, headers)
         .then((request) => {
          const normalizeRequest = normalize(request.data, itemsNormalizr)
          dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
          dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})

          request.data.forEach((item) => {
            dispatch(fetchItemRating(provider, item.id))
            dispatch(fetchItemSalesNumber(provider, item.id))
            dispatch(fetchUserRating(provider, item.user.wallet))
          })
       }).catch((error) => {
          console.log(error)
          if (error.response) {
            dispatch(setFlashMessage(error.response.data.error, 'error'))
          } else {
            dispatch(setFlashMessage("Error: Failed to retrieve items.. please try again later.", 'error'))
          }
       })
  }
}

export function selectItem(provider, itemId) {
  return dispatch => {
    return axios.get(`${ITEMS_URL}/${itemId}`, headers)
                .then((request) => {
                    const normalizeRequest = normalize(request.data, itemNormalizr)
                    dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
                    dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})
                    dispatch({type: SELECT_ITEM, payload: request.data.id})
                    dispatch(fetchItemRating(provider, request.data.id))
                    dispatch(fetchItemSalesNumber(provider, itemId))
                    dispatch(fetchUserRating(provider, request.data.user.wallet))
                })
  }
}

export function createItem(item_params) {
  return dispatch => {
    axios.post(ITEMS_URL, item_params, headers)
         .then((request) => {
          const normalizeRequest = normalize(request.data, itemNormalizr)
          dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
          dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})
          dispatch(setFlashMessage("Item has been successfully created.", 'success'))
       }).catch((error) => {
          if (error.request) {
            dispatch(setFlashMessage(error.request.data.error, 'error'))
          } else {
            dispatch(setFlashMessage("Error: Item couldn't be created, please try again later.", 'error'))
          }
       })
  }
}

export function fetchSellerItems(provider) {
  return dispatch => {
    axios.get(SELLER_ITEMS_URL, headers)
         .then((request) => {
          const normalizeRequest = normalize(request.data, itemsNormalizr)
          dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})

          request.data.forEach((item) => {
            dispatch(fetchItemSalesNumber(provider, item.id))
          })
       }).catch((error) => {
          console.log(error)
          if (error.response) {
            dispatch(setFlashMessage(error.response.data.error, 'error'))
          } else {
            dispatch(setFlashMessage("Error: Failed to retrieve items.. please try again later.", 'error'))
          }
       })
  }
}
