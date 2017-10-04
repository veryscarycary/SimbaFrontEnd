import { normalize } from 'normalizr'

import { itemsNormalizr, itemNormalizr } from '../models/normalizr'
import Api, { ITEMS_URL, USERS_URL } from '../services/api'
import { setFlashMessage } from './actions_flash_messages'
import { fetchItemSalesNumber, fetchItemRating, fetchUserRating } from './actions_contract'

import { CREATE_USERS } from './actions_users'

export const SELECT_ITEM = 'SELECT_ITEM'
export const CREATE_ITEM = 'CREATE_ITEM'
export const CREATE_ITEMS = 'CREATE_ITEMS'
export const UPDATE_ITEM = 'UPDATE_ITEM'

export function fetchAllItems(provider) {
  return dispatch => {
    return Api.get(ITEMS_URL)
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
    return Api.get(`${ITEMS_URL}/${itemId}`)
                .then((request) => {
                    const normalizeRequest = normalize(request.data, itemNormalizr)
                    dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
                    dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})
                    dispatch({type: SELECT_ITEM, payload: request.data.id})
                    dispatch(fetchItemRating(request.data.id))
                    dispatch(fetchItemSalesNumber(itemId))
                    dispatch(fetchUserRating(request.data.user.wallet))
                })
  }
}

export function createItem(item_params) {
  return dispatch => {
    return Api.post(ITEMS_URL, item_params)
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

export function updateItem(item_params, itemId) {
  return dispatch => {
    return Api.put(`${ITEMS_URL}/${itemId}`, item_params)
         .then((request) => {
          const normalizeRequest = normalize(request.data, itemNormalizr)
          dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
          dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})
          dispatch(setFlashMessage("Item has been successfully updated.", 'success'))
       }).catch((error) => {
          if (error.request) {
            dispatch(setFlashMessage(error.request.data.error, 'error'))
          } else {
            dispatch(setFlashMessage("Error: Item couldn't be updated, please try again later.", 'error'))
          }
       })
  }
}

export function fetchSellerItems(provider, wallet) {
  return dispatch => {
    return Api.get(`${USERS_URL}/${wallet}/items`)
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
