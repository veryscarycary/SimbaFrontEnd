import axios from 'axios'
import { normalize } from 'normalizr'

import { headers, PURCHASES_URL, BUYER_PURCHASES_URL, SELLER_PURCHASES_URL } from '../api_url'

import { setFlashMessage } from './actions_flash_messages'
import { purchase, fetchPurchaseState } from './actions_contract'
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
export function createPurchase(item, finalPrice, provider, history) {
  const params = {
    amount: finalPrice,
    item_id: item.id,
    address: '155 W Washington Blvd',
    postal_code: '90030',
    city: 'Los Angeles',
    us_state: 'CA',
    country: 'USA',
    seller_id: item.user.id
  }

  return dispatch => {
    return axios.post(PURCHASES_URL, params, headers)
                .then((request) => {
                  const normalizeRequest = normalize(request.data, purchaseNormalizr)
                  dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
                  dispatch({ type: SELECT_PURCHASE, payload: request.data.id })
                  dispatch(purchase(request.data.id, item.user.wallet, item.id, request.data.amount, provider, history))
              }).catch((error) => {
                  console.log(error)
                  if (error.response) {
                    dispatch(setFlashMessage(error.response.data.error, 'error'))
                  } else {
                    dispatch(setFlashMessage("Error: Transaction failed.. please try again later.", 'error'))
                  }

              })
  }
}

// Get one purchase information
export function fetchPurchase(purchaseId) {
  return dispatch => {
    axios.get(`${PURCHASES_URL}/${purchaseId}`, headers)
         .then((request) => {
            const normalizeRequest = normalize(request.data, purchaseNormalizr)
            dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
            dispatch({ type: SELECT_PURCHASE, payload: request.data.id })
         })
  }
}

// Fetch All User's Purchases and sort them between 'Pending' or 'Finalized' state
// Get Purchases State from the blockchain
export function fetchAllPurchases(provider, isBuyer) {
  const PURCHASE_API_URL = isBuyer ? BUYER_PURCHASES_URL : SELLER_PURCHASES_URL
  return dispatch => {
    axios.get(PURCHASE_API_URL, headers)
         .then((request) => {
          const normalizeRequest = normalize(request.data, purchasesNormalizr)
          dispatch({ type: CREATE_USERS, payload: normalizeRequest.entities.users })
          dispatch({ type: CREATE_ITEMS, payload: normalizeRequest.entities.items })
          dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
          request.data.forEach((purchase) => {
            dispatch(fetchPurchaseState(purchase, provider))
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

