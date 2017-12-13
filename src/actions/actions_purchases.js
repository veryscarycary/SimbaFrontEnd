import { normalize } from 'normalizr'

import Api, { PURCHASES_URL, BUYER_PURCHASES_URL, SELLER_PURCHASES_URL, PURCHASES_METRICS_URL } from '../services/api'

import { setFlashMessage } from './actions_flash_messages'
import { purchase, fetchPurchaseState, fetchPurchaseTimes } from './actions_contract'
import { CREATE_USERS } from './actions_users'
import { CREATE_ITEMS } from './actions_items'

import { purchasesNormalizr, purchaseNormalizr } from '../models/normalizr'

export const CREATE_PURCHASE = 'CREATE_PURCHASE'
export const CREATE_PURCHASES = 'CREATE_PURCHASES'
export const UPDATE_PURCHASE = 'UPDATE_PURCHASE'
export const SELECT_PURCHASE = 'SELECT_PURCHASE'

// Purchase one item
// Create locally first a purchase in mongodb
// Retrieve the purchaseId to send the transaction into the smart contract
export function createPurchase(item, finalPrice) {
  const params = {
    amount: finalPrice,
    item_id: item.id,
    address: '155 W Washington Blvd',
    postal_code: '90030',
    city: 'Los Angeles',
    us_state: 'CA',
    country: 'USA',
    seller_id: item.user.id,
    shipping_deadline: item.shipping_deadline
  }
  return dispatch => {
    return Api.post(PURCHASES_URL, params)
      .then((request) => {
        const normalizeRequest = normalize(request.data, purchaseNormalizr)
        dispatch({
          type: CREATE_PURCHASES,
          payload: normalizeRequest.entities.purchases,
        })
        dispatch({ type: SELECT_PURCHASE, payload: request.data.id })

        return dispatch(purchase(request.data.id, item.user.wallet, item.id, request.data.amount, item.shipping_deadline))
    })
  }
}

export function updatePurchaseState(purchase_params, purchaseId) {
  return dispatch => {
    return Api.put(`${PURCHASES_URL}/${purchaseId}`, purchase_params)
         .then((request) => {
          const normalizeRequest = normalize(request.data, purchaseNormalizr)
          dispatch({type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases})
          dispatch(setFlashMessage("Purchase has been successfully updated.", 'success'))
       }).catch((error) => {
          if (error.request) {
            dispatch(setFlashMessage(error.request.data.error, 'error'))
          } else {
            dispatch(setFlashMessage("Error: Purchase couldn't be updated, please try again later.", 'error'))
          }
       })
  }
}

// Get one purchase information
export function selectPurchase(purchaseId) {
  return dispatch => {
    Api.get(`${PURCHASES_URL}/${purchaseId}`)
         .then((request) => {
            const normalizeRequest = normalize(request.data, purchaseNormalizr)
            dispatch({ type: CREATE_ITEMS, payload: normalizeRequest.entities.items })
            dispatch({ type: CREATE_USERS, payload: normalizeRequest.entities.users })
            dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
            dispatch({ type: SELECT_PURCHASE, payload: request.data.id })
            dispatch(fetchPurchaseState(request.data))
            dispatch(fetchPurchaseTimes(request.data))
         })
  }
}

// Fetch All User's Purchases and sort them between 'Pending' or 'Finalized' state
// Get Purchases State from the blockchain
export function fetchAllPurchases(isBuyer) {
  const PURCHASE_API_URL = isBuyer ? BUYER_PURCHASES_URL : SELLER_PURCHASES_URL
  return dispatch => {
    Api.get(PURCHASE_API_URL)
         .then((request) => {
          const normalizeRequest = normalize(request.data, purchasesNormalizr)
          dispatch({ type: CREATE_USERS, payload: normalizeRequest.entities.users })
          dispatch({ type: CREATE_ITEMS, payload: normalizeRequest.entities.items })
          dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
          request.data.forEach((purchase) => {
            dispatch(fetchPurchaseState(purchase))
            dispatch(fetchPurchaseTimes(purchase))
          })
       }).catch((error) => {
        console.log(error)
        if (error.response) {
          dispatch(setFlashMessage(error.response.data.error, 'error'))
        } else {
          dispatch(setFlashMessage("Error: Failed to retrieve purchases.. please try again later.", 'error'))
        }
       })
  }
}

export function fetchPurchaseMetrics() {
  return dispatch => {
    return Api.get(PURCHASES_METRICS_URL)
         .then((request) => {
          return request.data
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
